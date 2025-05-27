const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Crear horario
exports.crearHorario = async (req, res) => {
  const { grupo_id, dia, hora_inicio, hora_fin, aula } = req.body;
  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `INSERT INTO Horario (grupo_id, dia, hora_inicio, hora_fin, aula)
       VALUES (:grupo_id, :dia, :hora_inicio, :hora_fin, :aula)`,
      { grupo_id, dia, hora_inicio, hora_fin, aula },
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ mensaje: 'Horario creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener horarios por grupo
exports.obtenerHorariosPorGrupo = async (req, res) => {
  const grupo_id = req.params.grupo_id;
  try {
    const conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT * FROM Horario WHERE grupo_id = :grupo_id`,
      [grupo_id]
    );
    await conn.close();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar horario
exports.actualizarHorario = async (req, res) => {
  const id = req.params.id;
  const { dia, hora_inicio, hora_fin, aula } = req.body;
  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `UPDATE Horario
       SET dia = :dia, hora_inicio = :hora_inicio, hora_fin = :hora_fin, aula = :aula
       WHERE horario_id = :id`,
      { dia, hora_inicio, hora_fin, aula, id },
      { autoCommit: true }
    );
    await conn.close();
    res.status(200).json({ mensaje: 'Horario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar horario
exports.eliminarHorario = async (req, res) => {
  const id = req.params.id;
  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `DELETE FROM Horario WHERE horario_id = :id`,
      [id],
      { autoCommit: true }
    );
    await conn.close();
    res.status(200).json({ mensaje: 'Horario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
