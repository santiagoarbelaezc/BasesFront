const oracledb = require('oracledb');
const dbConfig = require('../db-config');
exports.insertarExamenPresentado = async (req, res) => {
  let {
    fecha,
    horaInicio,
    horaFin,
    porcentaje,
    usuarioId,
    examenId
  } = req.body;

  try {
    fecha = new Date(fecha);

    // Convierte horaInicio y horaFin a Date y reemplaza su parte fecha con la de `fecha`
    const ajustarHora = (fechaBase, hora) => {
      const d = new Date(hora);
      d.setFullYear(fechaBase.getFullYear());
      d.setMonth(fechaBase.getMonth());
      d.setDate(fechaBase.getDate());
      return d;
    };

    horaInicio = ajustarHora(fecha, horaInicio);
    horaFin = ajustarHora(fecha, horaFin);

    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_EXAMEN_PRESENTADO(
        :fecha, :hora_inicio, :hora_fin, :porcentaje, :usuario_id, :examen_id
      ); END;`,
      {
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        porcentaje,
        usuario_id: usuarioId,
        examen_id: examenId
      }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Examen presentado insertado correctamente' });
  } catch (err) {
    console.error('Error en insertarExamenPresentado:', err);
    res.status(500).json({ error: err.message });
  }
};



exports.actualizarExamenPresentado = async (req, res) => {
  const { id } = req.params;
  let {
    fecha,
    hora_inicio,
    hora_fin,
    porcentaje,
    usuario_id,
    examen_id
  } = req.body;

  try {
    // Convertir fecha a Date con control de error
    let fechaDate;
    try {
      fechaDate = new Date(fecha);
      if (isNaN(fechaDate)) throw new Error('Fecha inválida');
    } catch (errorFecha) {
      console.error('Error al convertir fecha:', errorFecha);
      return res.status(400).json({ error: 'Fecha inválida o malformada' });
    }

    // Función para ajustar hora para que tenga la misma fecha que fechaDate
    const ajustarHora = (fechaBase, hora) => {
      if (!hora) return null; // Manejo de undefined o null
      try {
        const d = new Date(hora);
        if (isNaN(d)) throw new Error('Hora inválida');
        d.setFullYear(fechaBase.getFullYear());
        d.setMonth(fechaBase.getMonth());
        d.setDate(fechaBase.getDate());
        return d;
      } catch (errorHora) {
        console.error('Error al convertir hora:', errorHora);
        return null; // o lanza error si quieres forzar validación
      }
    };

    const horaInicioDate = ajustarHora(fechaDate, hora_inicio);
    const horaFinDate = ajustarHora(fechaDate, hora_fin);

    // Validar que horaInicioDate y horaFinDate no sean null (si es obligatorio)
    if (!horaInicioDate || !horaFinDate) {
      console.warn('Hora inicio o fin inválida o no proporcionada');
      // Puedes decidir si devolver error o continuar con null
    }

    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
    } catch (errorConexion) {
      console.error('Error al conectar con Oracle:', errorConexion);
      return res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }

    try {
      await connection.execute(
  `BEGIN ACTUALIZAR_EXAMEN_PRESENTADO(
    :id, :fecha, :hora_inicio, :hora_fin, :porcentaje, :usuario_id, :examen_id
  ); END;`,
  {
    id: parseInt(id),
    fecha: fechaDate, // OK como DATE
    hora_inicio: horaInicioDate, // debe ser Date con hora válida
    hora_fin: horaFinDate,
    porcentaje,
    usuario_id,
    examen_id
  },
  { autoCommit: true } // también puedes evitar hacer un `commit()` manual
);
    } catch (errorEjecutar) {
      console.error('Error al ejecutar procedimiento:', errorEjecutar);
      return res.status(500).json({ error: 'Error en procedimiento almacenado' });
    } finally {
      try {
        await connection.close();
      } catch (errorCerrar) {
        console.error('Error al cerrar conexión:', errorCerrar);
      }
    }

    res.status(200).json({ mensaje: 'Examen presentado actualizado correctamente' });
  } catch (err) {
    console.error('Error general actualizarExamenPresentado:', err);
    res.status(500).json({ error: err.message });
  }
};


// Eliminar examen presentado
exports.eliminarExamenPresentado = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_EXAMEN_PRESENTADO(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Examen presentado eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los examenes presentados
exports.obtenerExamenesPresentados = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM EXAMENPRESENTADO`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener examen presentado por id
exports.obtenerExamenPresentadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM EXAMENPRESENTADO WHERE EXAMEN_PRESENTADO_ID = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Examen presentado no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Obtener el último examen presentado por usuario_id
exports.obtenerUltimoExamenPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM (
         SELECT * FROM EXAMENPRESENTADO
         WHERE USUARIO_ID = :usuario_id
         ORDER BY FECHA DESC
       ) WHERE ROWNUM = 1`,
      { usuario_id: parseInt(usuario_id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró examen presentado para el usuario' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
