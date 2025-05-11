const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar contenido
exports.insertarContenido = async (req, res) => {
  const { nombre, unidad_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_CONTENIDO(:nombre, :unidad_id); END;`,
      { nombre, unidad_id }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Contenido insertado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar contenido
exports.actualizarContenido = async (req, res) => {
  const { id } = req.params;
  const { nombre, unidad_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_CONTENIDO(:id, :nombre, :unidad_id); END;`,
      { id: parseInt(id), nombre, unidad_id }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Contenido actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar contenido
exports.eliminarContenido = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_CONTENIDO(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Contenido eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
