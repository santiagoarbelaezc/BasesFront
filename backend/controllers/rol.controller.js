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
    // Agrega outFormat para devolver objetos
    const result = await connection.execute(
        `SELECT ROL_ID, NOMBRE FROM ROL`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }  // <-- Esta línea es clave
    );
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

    // Validación: nombre duplicado (excluyendo el actual)
    const result = await connection.execute(
        `SELECT COUNT(*) AS TOTAL FROM ROL WHERE UPPER(nombre) = UPPER(:nombre) AND rol_id != :rol_id`,
        { nombre, rol_id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows[0].TOTAL > 0) {
      return res.status(400).json({ error: '❌ Ya existe un rol con ese nombre' });
    }

    // Actualizar
    await connection.execute(
        `BEGIN actualizar_rol(:rol_id, :nombre); END;`,
        { rol_id, nombre },
        { autoCommit: true }
    );

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


exports.obtenerRolPorId = async (req, res) => {
  const rol_id = req.params.id;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT ROL_ID, NOMBRE FROM ROL WHERE ROL_ID = :rol_id`,
      [rol_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '❌ Rol no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al obtener rol' });
  } finally {
    if (connection) await connection.close();
  }
};
