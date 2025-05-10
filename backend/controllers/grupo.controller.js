const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar grupo
exports.insertarGrupo = async (req, res) => {
  const { nombre, curso_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_GRUPO(:nombre, :curso_id); END;`,
      { nombre, curso_id }
    );
    await connection.close();
    res.status(201).json({ mensaje: 'Grupo insertado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar grupo
exports.actualizarGrupo = async (req, res) => {
  const { id } = req.params;
  const { nombre, curso_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_GRUPO(:id, :nombre, :curso_id); END;`,
      { id: parseInt(id), nombre, curso_id }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Grupo actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar grupo
exports.eliminarGrupo = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_GRUPO(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Grupo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
