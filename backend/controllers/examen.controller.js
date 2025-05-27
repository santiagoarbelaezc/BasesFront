const oracledb = require('oracledb');
const dbConfig = require('../db-config');

const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar examen
exports.insertarExamen = async (req, res) => {
  const {
    examen,
    nombre,
    cantidad_preguntas,
    fecha,
    tiempo,
    pesoCurso,
    umbralDeAprobacion,
    asignacion,
    tema_id,
    categoria_id
  } = req.body;

  const parametros = {
    p_examen_num: examen,
    p_nombre: nombre,
    p_cantidad_preguntas: Number(cantidad_preguntas),
    p_fecha: new Date(fecha),
    p_tiempo: Number(tiempo),
    p_pesoCurso: Number(pesoCurso),
    p_umbral: Number(umbralDeAprobacion),
    p_asignacion: asignacion,
    p_tema_id: Number(tema_id),
    p_categoria_id: Number(categoria_id)
  };

  console.log('📤 Parámetros a enviar al procedimiento:', parametros);

  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Habilitar buffer para capturar DBMS_OUTPUT
    await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);

    await connection.execute(
      `BEGIN 
         INSERTAR_EXAMEN(
           :p_examen_num, :p_nombre, :p_cantidad_preguntas, :p_fecha, :p_tiempo,
           :p_pesoCurso, :p_umbral, :p_asignacion, :p_tema_id, :p_categoria_id
         ); 
       END;`,
      parametros
    );

    // Leer lo que se haya impreso con DBMS_OUTPUT.PUT_LINE en PL/SQL
    const result = await connection.execute(
      `BEGIN 
         FOR i IN 1..10 LOOP
           DBMS_OUTPUT.GET_LINE(:line, :status);
           EXIT WHEN :status != 0;
         END LOOP;
       END;`,
      {
        line: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
        status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('🧾 DBMS_OUTPUT:', result.outBinds?.line || 'Sin salida');

    await connection.commit();
    await connection.close();

    res.status(201).json({ mensaje: 'Examen insertado correctamente' });
  } catch (err) {
    console.error('❌ Error al insertar examen:', err);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar examen
exports.actualizarExamen = async (req, res) => {
  const { id } = req.params;
  const {
    examen,
    nombre,
    cantidad_preguntas,
    fecha,
    tiempo,
    pesoCurso,
    umbralDeAprobacion,
    asignacion,
    tema_id,
    categoria_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_EXAMEN(
        :id, :examen, :nombre, :cantidad_preguntas, :fecha, :tiempo,
        :pesoCurso, :umbralDeAprobacion, :asignacion, :tema_id, :categoria_id
      ); END;`,
      {
        id: parseInt(id),
        examen,
        nombre,
        cantidad_preguntas,
        fecha,
        tiempo,
        pesoCurso,
        umbralDeAprobacion,
        asignacion,
        tema_id,
        categoria_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Examen actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar examen
exports.eliminarExamen = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_EXAMEN(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Examen eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los examenes
exports.obtenerExamenes = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM EXAMEN`, // Ajusta la tabla o consulta según tu BD
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener examen por id
exports.obtenerExamenPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM EXAMEN WHERE examen_id = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Examen no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
