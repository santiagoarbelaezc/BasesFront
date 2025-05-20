const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar examen presentado
exports.insertarExamenPresentado = async (req, res) => {
  const {
    fecha,
    hora_inicio,
    hora_fin,
    porcentaje,
    usuario_id,
    examen_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_EXAMEN_PRESENTADO(
        :fecha, :hora_inicio, :hora_fin, :porcentaje, :usuario_id, :examen_id
      ); END;`,
      {
        fecha,
        hora_inicio,
        hora_fin,
        porcentaje,
        usuario_id,
        examen_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Examen presentado insertado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar examen presentado
exports.actualizarExamenPresentado = async (req, res) => {
  const { id } = req.params;
  const {
    fecha,
    hora_inicio,
    hora_fin,
    porcentaje,
    usuario_id,
    examen_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_EXAMEN_PRESENTADO(
        :id, :fecha, :hora_inicio, :hora_fin, :porcentaje, :usuario_id, :examen_id
      ); END;`,
      {
        id: parseInt(id),
        fecha,
        hora_inicio,
        hora_fin,
        porcentaje,
        usuario_id,
        examen_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Examen presentado actualizado correctamente' });
  } catch (err) {
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
      `SELECT * FROM EXAMEN_PRESENTADO`,
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
      `SELECT * FROM EXAMEN_PRESENTADO WHERE EXAMEN_PRESENTADO_ID = :id`,
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
