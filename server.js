const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Endpoint para agregar un nuevo cliente
app.post('/clients', async (req, res) => {
    const { name, email } = req.body; // Extrae los datos del cuerpo de la solicitud
    try {
        const result = await pool.query(
            'INSERT INTO clients (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]); // Retorna el cliente agregado
    } catch (err) {
        console.error(err); // Muestra el error en la consola
        res.status(500).send('Error al agregar el cliente'); // Responde con un error
    }
});

// Endpoint para agregar una nueva transacción
app.post('/transactions', async (req, res) => {
    const { client_id, transaction_date, amount, description, status, transaction_type, transaction_flow } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO transactions (client_id, transaction_date, amount, description, status, transaction_type, transaction_flow) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [client_id, transaction_date, amount, description, status, transaction_type, transaction_flow]
        );
        res.status(201).json(result.rows[0]); // Retorna la transacción agregada
    } catch (err) {
        console.error(err); // Muestra el error en la consola
        res.status(500).send('Error al agregar la transacción'); // Responde con un error
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
