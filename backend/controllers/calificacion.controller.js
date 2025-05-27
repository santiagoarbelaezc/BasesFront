const oracledb = require('oracledb');
const dbConfig = require('../db-config');


exports.obtenerNotaFinalPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      SELECT
        ep.usuario_id AS usuarioId,
        SUM((ep.porcentaje * e.pesocurso) / 100) AS notaFinal
      FROM
        EXAMENPRESENTADO ep
        JOIN EXAMEN e ON ep.examen_id = e.examen_id
      WHERE
        ep.usuario_id = :usuarioId
      GROUP BY ep.usuario_id
      `,
      [usuarioId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();
    res.json(result.rows[0] || { notaFinal: 0 });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};