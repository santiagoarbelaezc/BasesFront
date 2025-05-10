const oracledb = require('oracledb');
const dbConfig = require('../db-config');

exports.insertarRol = async (req, res) => {
  const { nombre } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN insertar_rol(:nombre); END;`, { nombre }, { autoCommit: true });
    res.json({ mensaje: '✅ Rol creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al crear rol' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.listarRoles = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT ROL_ID, NOMBRE FROM ROL`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al obtener roles' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.actualizarRol = async (req, res) => {
  const { nombre } = req.body;
  const rol_id = req.params.id;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN actualizar_rol(:rol_id, :nombre); END;`, { rol_id, nombre }, { autoCommit: true });
    res.json({ mensaje: '✅ Rol actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al actualizar rol' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.eliminarRol = async (req, res) => {
  const rol_id = req.params.id;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN eliminar_rol(:rol_id); END;`, { rol_id }, { autoCommit: true });
    res.json({ mensaje: '✅ Rol eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al eliminar rol' });
  } finally {
    if (connection) await connection.close();
  }
};
