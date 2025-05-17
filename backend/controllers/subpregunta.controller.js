const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar subpregunta
exports.insertarSubpregunta = async (req, res) => {
  const { texto, porcentaje, pregunta_id } = req.body;

  if (!texto || isNaN(porcentaje) || isNaN(pregunta_id)) {
    return res.status(400).json({ error: 'Datos inválidos para subpregunta.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `BEGIN INSERTAR_SUBPREGUNTA(:texto, :porcentaje, :pregunta_id, :id_out); END;`,
      {
        texto,
        porcentaje: parseFloat(porcentaje),
        pregunta_id: parseInt(pregunta_id),
        id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    await connection.commit();
    res.status(201).json({ id: result.outBinds.id_out, mensaje: 'Subpregunta insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Actualizar subpregunta
exports.actualizarSubpregunta = async (req, res) => {
  const { id } = req.params;
  const { texto, porcentaje, pregunta_id } = req.body;

  if (!texto || isNaN(id) || isNaN(porcentaje) || isNaN(pregunta_id)) {
    return res.status(400).json({ error: 'Datos inválidos para actualización.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ACTUALIZAR_SUBPREGUNTA(:id, :texto, :porcentaje, :pregunta_id); END;`,
      {
        id: parseInt(id),
        texto,
        porcentaje: parseFloat(porcentaje),
        pregunta_id: parseInt(pregunta_id)
      }
    );

    await connection.commit();
    res.status(200).json({ mensaje: 'Subpregunta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Eliminar subpregunta
exports.eliminarSubpregunta = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ELIMINAR_SUBPREGUNTA(:id); END;`,
      { id: parseInt(id) }
    );

    await connection.commit();
    res.status(200).json({ mensaje: 'Subpregunta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Obtener subpreguntas por ID de pregunta
exports.obtenerSubpreguntasPorPregunta = async (req, res) => {
  const { pregunta_id } = req.params;

  if (isNaN(pregunta_id)) {
    return res.status(400).json({ error: 'ID de pregunta inválido.' });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM SubPregunta WHERE pregunta_id = :pregunta_id`,
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
