const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar respuesta estudiante
exports.insertarRespuestaEstudiante = async (req, res) => {
  const { esCorrecta, examen_pres_id, pregunta_id } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN INSERTAR_RESPUESTA_ESTUDIANTE(:esCorrecta, :examen_pres_id, :pregunta_id); END;`,
      {
        esCorrecta,
        examen_pres_id,
        pregunta_id
      }
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({ mensaje: 'Respuesta estudiante insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar respuesta estudiante
exports.actualizarRespuestaEstudiante = async (req, res) => {
  const { id } = req.params;
  const { esCorrecta, examen_pres_id, pregunta_id } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ACTUALIZAR_RESPUESTA_ESTUDIANTE(:id, :esCorrecta, :examen_pres_id, :pregunta_id); END;`,
      {
        id: parseInt(id),
        esCorrecta,
        examen_pres_id,
        pregunta_id
      }
    );

    await connection.commit();
    await connection.close();

    res.status(200).json({ mensaje: 'Respuesta estudiante actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar respuesta estudiante
exports.eliminarRespuestaEstudiante = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ELIMINAR_RESPUESTA_ESTUDIANTE(:id); END;`,
      { id: parseInt(id) }
    );

    await connection.commit();
    await connection.close();

    res.status(200).json({ mensaje: 'Respuesta estudiante eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las respuestas estudiante
exports.obtenerRespuestasEstudiante = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM RESPUESTAESTUDIANTE`, // Ajusta el nombre si es necesario
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener respuesta estudiante por id
exports.obtenerRespuestaEstudiantePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM RESPUESTAESTUDIANTE WHERE RESPUESTA_ESTUDIANTE_ID = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Respuesta estudiante no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar respuesta estudiante por examen presentado y pregunta
exports.buscarPorExamenYPregunta = async (req, res) => {
  const { examenPresId, preguntaId } = req.query;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM RESPUESTAESTUDIANTE WHERE EXAMEN_PRES_ID = :examenPresId AND PREGUNTA_ID = :preguntaId`,
      {
        examenPresId: parseInt(examenPresId),
        preguntaId: parseInt(preguntaId)
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(200).json(null); // No se encontró, devuelve null
    }

    res.status(200).json(result.rows[0]); // Devuelve el primer resultado (debería ser único)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
