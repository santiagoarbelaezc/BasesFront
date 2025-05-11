const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar tema
exports.insertarTema = async (req, res) => {
  const { nombre, contenido_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_TEMA(:nombre, :contenido_id); END;`,
      { nombre, contenido_id }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Tema insertado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar tema
exports.actualizarTema = async (req, res) => {
  const { id } = req.params;
  const { nombre, contenido_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_TEMA(:id, :nombre, :contenido_id); END;`,
      { id: parseInt(id), nombre, contenido_id }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Tema actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar tema
exports.eliminarTema = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_TEMA(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Tema eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
