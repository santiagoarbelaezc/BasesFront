const oracledb = require('oracledb');
const dbConfig = require('../db-config');

exports.registrarUsuario = async (req, res) => {
  const { nombre, apellido, correo, contrasena, rol_id } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN insertar_usuario(:nombre, :apellido, :correo, :contrasena, :rol_id); END;`,
      { nombre, apellido, correo, contrasena, rol_id },
      { autoCommit: true }
    );
    res.status(201).json({ mensaje: '✅ Usuario registrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al registrar usuario' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.loginUsuario = async (req, res) => {
  const { username, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT usuario_id, nombre FROM USUARIO WHERE correo = :username AND contraseña = :password`,
      { username, password }
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '❌ Credenciales incorrectas' });
    }
    res.json({ mensaje: '✅ Login exitoso', usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al iniciar sesión' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.actualizarUsuario = async (req, res) => {
  const usuario_id = req.params.id;
  const { nombre, apellido, correo, contrasena, rol_id } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN actualizar_usuario(:usuario_id, :nombre, :apellido, :correo, :contrasena, :rol_id); END;`,
      { usuario_id, nombre, apellido, correo, contrasena, rol_id },
      { autoCommit: true }
    );
    res.json({ mensaje: '✅ Usuario actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al actualizar usuario' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.eliminarUsuario = async (req, res) => {
  const usuario_id = req.params.id;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN eliminar_usuario(:usuario_id); END;`,
      { usuario_id },
      { autoCommit: true }
    );
    res.json({ mensaje: '✅ Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al eliminar usuario' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.obtenerUsuarios = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT usuario_id, nombre, apellido, correo, rol_id FROM USUARIO`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al obtener usuarios' });
  } finally {
    if (connection) await connection.close();
  }
};
