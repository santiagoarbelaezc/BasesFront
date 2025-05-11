const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar categoría
exports.insertarCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN INSERTAR_CATEGORIA(:nombre); END;`, { nombre });
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Categoría insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN ACTUALIZAR_CATEGORIA(:id, :nombre); END;`, {
      id: parseInt(id),
      nombre,
    });
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN ELIMINAR_CATEGORIA(:id); END;`, { id: parseInt(id) });
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
