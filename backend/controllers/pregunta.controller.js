const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar pregunta
exports.insertarPregunta = async (req, res) => {
  const { texto, examen_id } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_PREGUNTA(:texto, :examen_id); END;`,
      {
        texto,
        examen_id: parseInt(examen_id)
      }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Pregunta insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar pregunta
exports.actualizarPregunta = async (req, res) => {
  const { id } = req.params;
  const { texto, examen_id } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_PREGUNTA(:id, :texto, :examen_id); END;`,
      {
        id: parseInt(id),
        texto,
        examen_id: parseInt(examen_id)
      }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Pregunta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar pregunta
exports.eliminarPregunta = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_PREGUNTA(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Pregunta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM PREGUNTA`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener pregunta por id
exports.obtenerPreguntaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM PREGUNTA WHERE PREGUNTA_ID = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Pregunta no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
