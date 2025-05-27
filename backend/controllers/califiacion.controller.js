exports.obtenerNotaFinalPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  const connection = await oracledb.getConnection(dbConfig);
  const result = await connection.execute(`
    SELECT
      ep.usuario_usuario_id AS usuarioId,
      SUM((ep.porcentaje * e.pesoCurso) / 100) AS notaFinal
    FROM
      ExmanePresentado ep
      JOIN Examen e ON ep.Examen_Examen_ID = e.Examen_ID
    WHERE
      ep.usuario_usuario_id = :usuarioId
    GROUP BY ep.usuario_usuario_id
  `, [usuarioId]);

  await connection.close();
  res.json(result.rows.length > 0 ? result.rows[0] : { notaFinal: 0 });
};
