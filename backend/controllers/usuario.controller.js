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
    console.error('Error en actualizarUsuario:', err);  // <- Para ver error real en consola backend
    res.status(500).json({ 
      error: '❌ Error al actualizar usuario',
      detalles: err.message,
      stack: err.stack
    });
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

exports.obtenerUsuarioPorCorreo = async (req, res) => {
  const { correo } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT usuario_id, nombre, apellido, correo, rol_id FROM USUARIO WHERE correo = :correo`,
      { correo }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '❌ Usuario no encontrado con ese correo' });
    }

    const [usuario_id, nombre, apellido, correoBD, rol_id] = result.rows[0];
    res.json({
      id: usuario_id,
      nombre,
      apellido,
      correo: correoBD,
      rol_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al obtener usuario por correo' });
  } finally {
    if (connection) await connection.close();
  }
};


exports.obtenerUsuariosPorRol = async (req, res) => {
  const rol_id = parseInt(req.params.rol_id);
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT usuario_id, nombre, apellido, correo, rol_id FROM USUARIO WHERE rol_id = :rol_id`,
      { rol_id }
    );

    const usuarios = result.rows.map(row => ({
      id: row[0],
      nombre: row[1],
      apellido: row[2],
      correo: row[3],
      rol_id: row[4]
    }));

    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Error al obtener usuarios por rol' });
  } finally {
    if (connection) await connection.close();
  }

  exports.obtenerInfoAcademica = async (req, res) => {
  const usuarioId = req.params.id;
  let connection;

  const sql = `
    SELECT 
      g.nombre AS grupo,
      c.nombre AS curso,
      u.nombre AS unidad,
      co.nombre AS contenido,
      t.nombre AS tema
    FROM usuario_grupo ug
    JOIN grupo g ON ug.grupo_grupo_id = g.grupo_id
    JOIN curso c ON g.curso_curso_id = c.curso_id
    JOIN unidad u ON u.curso_curso_id = c.curso_id
    JOIN contenido co ON co.unidad_unidad_id = u.unidad_id
    JOIN tema t ON t.contenido_contenido_id = co.contenido_id
    WHERE ug.usuario_usuario_id = :usuarioId
  `;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(sql, [usuarioId], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener información académica:', err);
    res.status(500).json({ error: 'Error al obtener información académica' });
  } finally {
    if (connection) await connection.close();
  }
};

};
