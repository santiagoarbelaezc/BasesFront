const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar grupo
exports.insertarGrupo = async (req, res) => {
  const { nombre, cursoId } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_GRUPO(:nombre, :curso_id); END;`,
      { nombre, curso_id: cursoId }
    );
    await connection.close();
    res.status(201).json({ mensaje: 'Grupo insertado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los grupos
exports.obtenerGrupos = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT GRUPO_ID, NOMBRE, CURSO_ID FROM GRUPO ORDER BY GRUPO_ID`
    );
    await connection.close();
    res.json(result.rows.map(row => ({
      GRUPO_ID: row[0],
      NOMBRE: row[1],
      CURSO_ID: row[2]
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener grupo por ID
exports.obtenerGrupoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT GRUPO_ID, NOMBRE, CURSO_ID FROM GRUPO WHERE GRUPO_ID = :id`,
      [parseInt(id)]
    );
    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }

    const row = result.rows[0];
    res.json({
      GRUPO_ID: row[0],
      NOMBRE: row[1],
      CURSO_ID: row[2]
    });
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

// Obtener usuarios asignados a un grupo
exports.obtenerUsuariosPorGrupo = async (req, res) => {
  const { grupoId } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT u.USUARIO_ID, u.NOMBRE, u.APELLIDO, u.CORREO
       FROM USUARIO u
       JOIN USUARIO_GRUPO ug ON u.USUARIO_ID = ug.USUARIO_ID
       WHERE ug.GRUPO_ID = :grupoId`,
      [parseInt(grupoId)]
    );
    await connection.close();

    const usuarios = result.rows.map(row => ({
      USUARIO_ID: row[0],
      NOMBRE: row[1],
      APELLIDO: row[2],
      CORREO: row[3]
    }));

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Quitar usuario de un grupo
exports.quitarUsuarioDeGrupo = async (req, res) => {
  const { grupoId, usuarioId } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `DELETE FROM USUARIO_GRUPO WHERE GRUPO_ID = :grupoId AND USUARIO_ID = :usuarioId`,
      { grupoId: parseInt(grupoId), usuarioId: parseInt(usuarioId) }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Usuario removido del grupo correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.asignarUsuarioAGrupo = async (req, res) => {
  let { usuarioId, grupoId } = req.body;

  usuarioId = parseInt(usuarioId);
  grupoId = parseInt(grupoId);

  if (isNaN(usuarioId) || isNaN(grupoId)) {
    return res.status(400).json({ error: 'usuarioId y grupoId deben ser números válidos' });
  }

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN
         INSERTAR_USUARIO_GRUPO(:usuarioId, :grupoId);
       END;`,
      { usuarioId, grupoId }
    );

    // ⚠️ NECESARIO PARA GUARDAR LOS CAMBIOS
    await connection.commit();

    await connection.close();

    res.status(201).json({ mensaje: 'Estudiante asignado al grupo correctamente mediante procedimiento' });
  } catch (err) {
    console.error('[asignarUsuarioAGrupo] Error:', err);
    res.status(500).json({ error: err.message });
  }
};
