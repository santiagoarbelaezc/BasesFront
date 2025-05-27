const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar respuesta
exports.insertarRespuesta = async (req, res) => {
  const { texto, esCorrecto, pregunta_id } = req.body;

  if (!texto || isNaN(esCorrecto) || isNaN(pregunta_id)) {
    return res.status(400).json({ error: 'Datos inválidos para la respuesta.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_RESPUESTA(:texto, :esCorrecto, :pregunta_id); END;`,
      {
        texto,
        esCorrecto: parseInt(esCorrecto),
        pregunta_id: parseInt(pregunta_id)
      }
    );

    await connection.commit();
    res.status(201).json({ mensaje: 'Respuesta insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Actualizar respuesta
exports.actualizarRespuesta = async (req, res) => {
  const { id } = req.params;
  const { texto, esCorrecto, pregunta_id } = req.body;

  if (!texto || isNaN(id) || isNaN(esCorrecto) || isNaN(pregunta_id)) {
    return res.status(400).json({ error: 'Datos inválidos para la actualización.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_RESPUESTA(:id, :texto, :esCorrecto, :pregunta_id); END;`,
      {
        id: parseInt(id),
        texto,
        esCorrecto: parseInt(esCorrecto),
        pregunta_id: parseInt(pregunta_id)
      }
    );
    await connection.commit();
    res.status(200).json({ mensaje: 'Respuesta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Eliminar respuesta
exports.eliminarRespuesta = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido para eliminar.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_RESPUESTA(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    res.status(200).json({ mensaje: 'Respuesta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Obtener todas las respuestas
exports.obtenerRespuestas = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM RESPUESTA`,
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

// Obtener respuesta por ID
exports.obtenerRespuestaPorId = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido para consulta.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM RESPUESTA WHERE RESPUESTA_ID = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Respuesta no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Obtener respuestas por ID de pregunta
exports.obtenerRespuestasPorPregunta = async (req, res) => {
  const { pregunta_id } = req.params;

  if (isNaN(pregunta_id)) {
    return res.status(400).json({ error: 'ID de pregunta inválido.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM RESPUESTA WHERE PREGUNTA_ID = :pregunta_id`,
      { pregunta_id: parseInt(pregunta_id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


// Obtener respuestas por pregunta_id
exports.obtenerRespuestasPorPreguntaId = async (req, res) => {
  const { preguntaId } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM RESPUESTA WHERE PREGUNTA_ID = :preguntaId`,
      { preguntaId: parseInt(preguntaId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
