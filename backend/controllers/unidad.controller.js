const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar unidad
exports.insertarUnidad = async (req, res) => {
  const { nombre, curso_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_UNIDAD(:nombre, :curso_id); END;`,
      { nombre, curso_id }
    );
    await connection.close();
    res.status(201).json({ mensaje: 'Unidad insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar unidad
exports.actualizarUnidad = async (req, res) => {
  const { id } = req.params;
  const { nombre, curso_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_UNIDAD(:id, :nombre, :curso_id); END;`,
      { id: parseInt(id), nombre, curso_id }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Unidad actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar unidad
exports.eliminarUnidad = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_UNIDAD(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Unidad eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
