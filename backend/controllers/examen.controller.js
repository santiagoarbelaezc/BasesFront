const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar examen
exports.insertarExamen = async (req, res) => {
  const {
    examen,
    nombre,
    cantidad_preguntas,
    fecha,
    tiempo,
    pesoCurso,
    umbralDeAprobacion,
    asignacion,
    tema_id,
    categoria_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_EXAMEN(
        :examen, :nombre, :cantidad_preguntas, :fecha, :tiempo,
        :pesoCurso, :umbralDeAprobacion, :asignacion, :tema_id, :categoria_id
      ); END;`,
      {
        examen,
        nombre,
        cantidad_preguntas,
        fecha,
        tiempo,
        pesoCurso,
        umbralDeAprobacion,
        asignacion,
        tema_id,
        categoria_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Examen insertado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar examen
exports.actualizarExamen = async (req, res) => {
  const { id } = req.params;
  const {
    examen,
    nombre,
    cantidad_preguntas,
    fecha,
    tiempo,
    pesoCurso,
    umbralDeAprobacion,
    asignacion,
    tema_id,
    categoria_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_EXAMEN(
        :id, :examen, :nombre, :cantidad_preguntas, :fecha, :tiempo,
        :pesoCurso, :umbralDeAprobacion, :asignacion, :tema_id, :categoria_id
      ); END;`,
      {
        id: parseInt(id),
        examen,
        nombre,
        cantidad_preguntas,
        fecha,
        tiempo,
        pesoCurso,
        umbralDeAprobacion,
        asignacion,
        tema_id,
        categoria_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Examen actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar examen
exports.eliminarExamen = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_EXAMEN(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Examen eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los examenes
exports.obtenerExamenes = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM EXAMEN`, // Ajusta la tabla o consulta según tu BD
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
