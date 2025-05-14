const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Ejecutar procedimiento de asignación automática
exports.asignarPreguntas = async (req, res) => {
  const examenId = parseInt(req.params.id);

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN ASIGNAR_PREGUNTAS_AUTOMATICO(:examen_id); END;`,
      { examen_id: examenId }
    );

    await connection.commit();
    await connection.close();

    res.status(200).json({ mensaje: 'Preguntas asignadas automáticamente al examen.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
