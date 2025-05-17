const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar respuesta
exports.insertarRespuesta = async (req, res) => {
  const { texto, esCorrecto, pregunta_id } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN INSERTAR_RESPUESTA(:texto, :esCorrecto, :pregunta_id); END;`,
      {
        texto,
        esCorrecto,
        pregunta_id
      }
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({ mensaje: 'Respuesta insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar respuesta
exports.actualizarRespuesta = async (req, res) => {
  const { id } = req.params;
  const { texto, esCorrecto, pregunta_id } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ACTUALIZAR_RESPUESTA(:id, :texto, :esCorrecto, :pregunta_id); END;`,
      {
        id: parseInt(id),
        texto,
        esCorrecto,
        pregunta_id
      }
    );

    await connection.commit();
    await connection.close();

    res.status(200).json({ mensaje: 'Respuesta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar respuesta
exports.eliminarRespuesta = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ELIMINAR_RESPUESTA(:id); END;`,
      { id: parseInt(id) }
    );

    await connection.commit();
    await connection.close();

    res.status(200).json({ mensaje: 'Respuesta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las respuestas
exports.obtenerRespuestas = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM RESPUESTA`, // Ajusta el nombre si es necesario
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener respuesta por id
exports.obtenerRespuestaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM RESPUESTA WHERE RESPUESTA_ID = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Respuesta no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
