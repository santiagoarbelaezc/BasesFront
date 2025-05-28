const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar unidad
exports.insertarUnidad = async (req, res) => {
  const { nombre, cursoId } = req.body;
  const curso_id = cursoId;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN INSERTAR_UNIDAD(:nombre, :curso_id); END;`,
      { nombre, curso_id }
    );

    await connection.close();

    res.status(201).json({ mensaje: 'Unidad insertada correctamente' });
  } catch (err) {
  
    res.status(500).json({ error: err.message });
  }
};


// Actualizar unidad
exports.actualizarUnidad = async (req, res) => {
  const { id } = req.params;
  const { nombre, curso_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ACTUALIZAR_UNIDAD(:id, :nombre, :curso_id); END;`,
      { id: parseInt(id), nombre, curso_id }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Unidad actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar unidad
exports.eliminarUnidad = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `BEGIN ELIMINAR_UNIDAD(:id); END;`,
      { id: parseInt(id) }
    );
    await connection.close();
    res.status(200).json({ mensaje: 'Unidad eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerUnidadesConContenidosYTemas = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // 1. Obtener unidades
    const unidadesResult = await connection.execute(
      `SELECT unidad_id, nombre FROM unidad`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const unidades = unidadesResult.rows;

    // 2. Obtener contenidos por unidad
    for (const unidad of unidades) {
      const contenidosResult = await connection.execute(
        `SELECT contenido_id, nombre FROM contenido WHERE unidad_id = :unidad_id`,
        { unidad_id: unidad.UNIDAD_ID },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const contenidos = contenidosResult.rows;

      // 3. Obtener temas por contenido
      for (const contenido of contenidos) {
        const temasResult = await connection.execute(
          `SELECT tema_id, nombre FROM tema WHERE contenido_id = :contenido_id`,
          { contenido_id: contenido.CONTENIDO_ID },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        contenido.temas = temasResult.rows;
      }

      unidad.contenidos = contenidos;
    }

    res.status(200).json(unidades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar unidades completas' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error al cerrar conexión:', closeErr);
      }
    }
  }
};
