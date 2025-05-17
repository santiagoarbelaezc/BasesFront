const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar pregunta
exports.insertarPregunta = async (req, res) => {
  const { texto, examen_id } = req.body;

  if (!texto || isNaN(examen_id)) {
    return res.status(400).json({ error: 'Texto o examen_id inválido.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_PREGUNTA(:texto, :examen_id); END;`,
      {
        texto,
        examen_id: parseInt(examen_id)
      }
    );
    await connection.commit();
    res.status(201).json({ mensaje: 'Pregunta insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Actualizar pregunta
exports.actualizarPregunta = async (req, res) => {
  const { id } = req.params;
  const { texto, examen_id } = req.body;

  if (!texto || isNaN(id) || isNaN(examen_id)) {
    return res.status(400).json({ error: 'Datos inválidos para la actualización.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_PREGUNTA(:id, :texto, :examen_id); END;`,
      {
        id: parseInt(id),
        texto,
        examen_id: parseInt(examen_id)
      }
    );
    await connection.commit();
    res.status(200).json({ mensaje: 'Pregunta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Eliminar pregunta
exports.eliminarPregunta = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_PREGUNTA(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    res.status(200).json({ mensaje: 'Pregunta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM PREGUNTA`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Obtener pregunta por ID
exports.obtenerPreguntaPorId = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM PREGUNTA WHERE PREGUNTA_ID = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Pregunta no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
