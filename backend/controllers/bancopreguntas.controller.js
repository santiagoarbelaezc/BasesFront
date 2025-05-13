const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar pregunta en banco
exports.insertarPregunta = async (req, res) => {
  const {
    texto,
    es_publica,
    revision,
    dificultad_id,
    categoria_id,
    tema_id,
    usuario_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN INSERTAR_BANCOPREGUNTA(
        :texto, :es_publica, :revision,
        :dificultad_id, :categoria_id, :tema_id, :usuario_id
      ); END;`,
      {
        texto,
        es_publica,
        revision,
        dificultad_id,
        categoria_id,
        tema_id,
        usuario_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Pregunta insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar pregunta
exports.actualizarPregunta = async (req, res) => {
  const { id } = req.params;
  const {
    texto,
    es_publica,
    revision,
    dificultad_id,
    categoria_id,
    tema_id,
    usuario_id
  } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_BANCOPREGUNTA(
        :id, :texto, :es_publica, :revision,
        :dificultad_id, :categoria_id, :tema_id, :usuario_id
      ); END;`,
      {
        id: parseInt(id),
        texto,
        es_publica,
        revision,
        dificultad_id,
        categoria_id,
        tema_id,
        usuario_id
      }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Pregunta actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar pregunta
exports.eliminarPregunta = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_BANCOPREGUNTA(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Pregunta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
