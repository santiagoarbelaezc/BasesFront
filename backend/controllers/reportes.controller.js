const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Utilidad para calcular duración
function calcularDuracion(inicio, fin) {
  const diff = new Date(fin) - new Date(inicio);
  const minutos = Math.floor(diff / 60000);
  const segundos = Math.floor((diff % 60000) / 1000);
  return `${minutos}:${segundos.toString().padStart(2, '0')}`;
}

// 1️⃣ Exámenes presentados
exports.getExamenesPresentados = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
         ep.FECHA,
         u.NOMBRE || ' ' || u.APELLIDO AS ESTUDIANTE,
         e.NOMBRE AS EXAMEN,
         ep.HORA_INICIO,
         ep.HORA_FIN,
         ep.PORCENTAJE
       FROM EXAMENPRESENTADO ep
       JOIN USUARIO u ON ep.USUARIO_ID = u.USUARIO_ID
       JOIN EXAMEN e ON ep.EXAMEN_ID = e.EXAMEN_ID`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const examenes = result.rows.map(row => ({
      estudiante: row.ESTUDIANTE,
      examen: row.EXAMEN,
      fecha: row.FECHA,
      puntaje: row.PORCENTAJE,
      tiempo: calcularDuracion(row.HORA_INICIO, row.HORA_FIN),
      ip: "No disponible" // No hay columna IP en tu tabla
    }));

    res.status(200).json(examenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 2️⃣ Estadísticas por pregunta
exports.getEstadisticasPorPregunta = async (req, res) => {
  const { examenId } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
         p.PREGUNTA_ID,
         p.TEXTO,
         COUNT(re.RESPUESTA_ESTUDIANTE_ID) AS TOTAL_RESPUESTAS,
         SUM(CASE WHEN re.ESCORRECTA = 1 THEN 1 ELSE 0 END) AS CORRECTAS,
         SUM(CASE WHEN re.ESCORRECTA = 0 THEN 1 ELSE 0 END) AS INCORRECTAS
       FROM PREGUNTA p
       LEFT JOIN RESPUESTAESTUDIANTE re ON p.PREGUNTA_ID = re.PREGUNTA_ID
       WHERE p.EXAMEN_ID = :examenId
       GROUP BY p.PREGUNTA_ID, p.TEXTO`,
      { examenId: parseInt(examenId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const estadisticas = result.rows.map(row => {
      const total = row.TOTAL_RESPUESTAS || 0;
      const correctas = row.CORRECTAS || 0;
      const porcentaje = total > 0 ? ((correctas / total) * 100).toFixed(1) : 0;
      return {
        pregunta: row.TEXTO,
        vecesRespondida: total,
        correctas: correctas,
        incorrectas: row.INCORRECTAS || 0,
        porcentajeCorrectas: Number(porcentaje)
      };
    });

    res.status(200).json(estadisticas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 3️⃣ Resumen por curso
exports.getResumenCurso = async (req, res) => {
  const { cursoId } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
         c.NOMBRE AS CURSO,
         g.NOMBRE AS GRUPO,
         COUNT(ep.EXAMEN_PRESENTADO_ID) AS TOTAL,
         ROUND(AVG(ep.PORCENTAJE), 2) AS PROMEDIO,
         MIN(ep.PORCENTAJE) AS MINIMA,
         MAX(ep.PORCENTAJE) AS MAXIMA,
         SUM(CASE WHEN ep.PORCENTAJE >= e.UMBRALDEAPROBACION THEN 1 ELSE 0 END) AS APROBADOS,
         SUM(CASE WHEN ep.PORCENTAJE < e.UMBRALDEAPROBACION THEN 1 ELSE 0 END) AS REPROBADOS
       FROM EXAMENPRESENTADO ep
       JOIN EXAMEN e ON ep.EXAMEN_ID = e.EXAMEN_ID
       JOIN USUARIO u ON ep.USUARIO_ID = u.USUARIO_ID
       JOIN USUARIO_GRUPO ug ON ug.USUARIO_ID = u.USUARIO_ID
       JOIN GRUPO g ON g.GRUPO_ID = ug.GRUPO_ID
       JOIN CURSO c ON c.CURSO_ID = g.CURSO_ID
       WHERE c.CURSO_ID = :cursoId
       GROUP BY c.NOMBRE, g.NOMBRE`,
      { cursoId: parseInt(cursoId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay datos para este curso' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error en getResumenCurso:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 4️⃣ Listado de notas por curso
exports.getNotasPorCurso = async (req, res) => {
  const { cursoId } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
         u.NOMBRE || ' ' || u.APELLIDO AS ESTUDIANTE,
         g.NOMBRE AS GRUPO,
         e.NOMBRE AS EXAMEN,
         ep.PORCENTAJE AS NOTA
       FROM EXAMENPRESENTADO ep
       JOIN EXAMEN e ON ep.EXAMEN_ID = e.EXAMEN_ID
       JOIN USUARIO u ON ep.USUARIO_ID = u.USUARIO_ID
       JOIN USUARIO_GRUPO ug ON ug.USUARIO_ID = u.USUARIO_ID
       JOIN GRUPO g ON g.GRUPO_ID = ug.GRUPO_ID
       JOIN CURSO c ON c.CURSO_ID = g.CURSO_ID
       WHERE c.CURSO_ID = :cursoId
       ORDER BY g.NOMBRE, ESTUDIANTE`,
      { cursoId: parseInt(cursoId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

exports.getExamenesPresentadosPorExamen = async (req, res) => {
  const { examenId } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
         ep.FECHA,
         u.NOMBRE || ' ' || u.APELLIDO AS ESTUDIANTE,
         e.NOMBRE AS EXAMEN,
         ep.HORA_INICIO,
         ep.HORA_FIN,
         ep.PORCENTAJE,
         ep.EXAMEN_ID
       FROM EXAMEN_PRESENTADO ep
       JOIN USUARIO u ON ep.USUARIO_ID = u.USUARIO_ID
       JOIN EXAMEN e ON ep.EXAMEN_ID = e.EXAMEN_ID
       WHERE ep.EXAMEN_ID = :examenId`,
      { examenId: parseInt(examenId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const examenes = result.rows.map(row => ({
      estudiante: row.ESTUDIANTE,
      examen: row.EXAMEN,
      examenId: row.EXAMEN_ID,
      fecha: row.FECHA,
      puntaje: row.PORCENTAJE,
      tiempo: calcularDuracion(row.HORA_INICIO, row.HORA_FIN)
    }));

    res.status(200).json(examenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
