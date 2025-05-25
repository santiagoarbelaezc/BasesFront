const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar curso
exports.crearCurso = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_CURSO(:nombre, :descripcion); END;`,
      { nombre, descripcion },
      { autoCommit: true }
    );
    await connection.close();
    res.status(201).json({ mensaje: 'Curso creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar curso
exports.actualizarCurso = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_CURSO(:id, :nombre, :descripcion); END;`,
      {
        id: parseInt(id),
        nombre,
        descripcion
      },
      { autoCommit: true }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Curso actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar curso
exports.eliminarCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_CURSO(:id); END;`,
      { id: parseInt(id) },
      { autoCommit: true }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Curso eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los cursos
exports.obtenerCursos = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT CURSO_ID, NOMBRE, DESCRIPCION FROM CURSO`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
