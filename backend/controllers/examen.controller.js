

const oracledb = require('oracledb');
const dbConfig = require('../db-config');

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

  const parametros = {
    p_examen_num: Number(examen),
    p_nombre: nombre,
    p_cantidad_preguntas: Number(cantidad_preguntas),
    p_fecha: new Date(fecha),
    p_tiempo: new Date(fecha), // Usa el mismo valor que `fecha` si no tienes otro TIMESTAMP
    p_pesoCurso: Number(pesoCurso),
    p_umbral: Number(umbralDeAprobacion),
    p_asignacion: Number(asignacion),
    p_tema_id: Number(tema_id),
    p_categoria_id: Number(categoria_id)
  };

  // LOG: tipos
  console.log("📦 Parámetros enviados a Oracle:");
  for (const [key, value] of Object.entries(parametros)) {
    console.log(`🔹 ${key}:`, value, '| tipo:', typeof value);
  }

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_EXAMEN(
        :p_examen_num, :p_nombre, :p_cantidad_preguntas, :p_fecha, :p_tiempo,
        :p_pesoCurso, :p_umbral, :p_asignacion, :p_tema_id, :p_categoria_id
      ); END;`,
      parametros
    );

    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: '✅ Examen insertado correctamente' });
  } catch (err) {
    console.error("❌ Error al insertar examen:", err);
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

// Obtener examen por id
exports.obtenerExamenPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM EXAMEN WHERE examen_id = :id`,
      { id: parseInt(id) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Examen no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
