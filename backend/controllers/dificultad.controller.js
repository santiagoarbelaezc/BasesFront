const oracledb = require('oracledb');
const dbConfig = require('../db-config');

// Insertar dificultad
exports.insertarDificultad = async (req, res) => {
  const { nombre } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN INSERTAR_DIFICULTAD(:nombre); END;`, { nombre });
    await connection.commit();
    await connection.close();
    res.status(201).json({ mensaje: 'Dificultad insertada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar dificultad
exports.actualizarDificultad = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN ACTUALIZAR_DIFICULTAD(:id, :nombre); END;`, {
      id: parseInt(id),
      nombre,
    });
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Dificultad actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar dificultad
exports.eliminarDificultad = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN ELIMINAR_DIFICULTAD(:id); END;`, { id: parseInt(id) });
    await connection.commit();
    await connection.close();
    res.status(200).json({ mensaje: 'Dificultad eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Obtener todas las dificultades
exports.obtenerDificultades = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT dificultad_id, nombre FROM dificultad` // Ajusta el nombre de la tabla y columnas
    );
    await connection.close();

    // Mapea las filas al formato que usa el frontend
    const dificultades = result.rows.map(row => ({
      DIFICULTAD_ID: row[0],
      NOMBRE: row[1],
    }));

    res.status(200).json(dificultades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
