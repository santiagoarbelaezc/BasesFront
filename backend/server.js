const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dbConfig = require('./db-config');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/insertar-usuario', async (req, res) => {
  const { nombre, apellido } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `BEGIN insertar_usuario(:nombre, :apellido); END;`,
      { nombre, apellido }
    );

    await connection.commit();
    res.send({ mensaje: "✅ Usuario insertado con PL/SQL" });

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error al ejecutar procedimiento");
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));
