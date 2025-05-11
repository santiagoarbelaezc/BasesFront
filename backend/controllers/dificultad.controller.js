const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar dificultad
exports.insertarDificultad = async (req, res) => {
  const { nombre } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN INSERTAR_DIFICULTAD(:nombre); END;`, { nombre });
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Dificultad insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar dificultad
exports.actualizarDificultad = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN ACTUALIZAR_DIFICULTAD(:id, :nombre); END;`, {
      id: parseInt(id),
      nombre,
    });
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Dificultad actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar dificultad
exports.eliminarDificultad = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN ELIMINAR_DIFICULTAD(:id); END;`, { id: parseInt(id) });
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Dificultad eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
