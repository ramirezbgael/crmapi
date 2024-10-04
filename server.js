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

// Endpoint para obtener todos los clientes
app.get('/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients'); // Consulta para obtener todos los clientes
        res.status(200).json(result.rows); // Devuelve los clientes encontrados
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los clientes');
    }
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

// Endpoint para agregar un producto
app.post('/products', async (req, res) => {
    const { client_id, product_name, description, interest_rate } = req.body; // Asegúrate de que estos sean los campos correctos
    try {
        const result = await pool.query(
            'INSERT INTO products (client_id, product_name, description, interest_rate, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [client_id, product_name, description, interest_rate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el producto');
    }
});

// Endpoint para obtener las transacciones de un cliente específico
app.get('/transactions/:client_id', async (req, res) => {
    const { client_id } = req.params; // Obtiene el ID del cliente desde los parámetros de la ruta
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE client_id = $1', [client_id]);
        res.status(200).json(result.rows); // Devuelve las transacciones encontradas
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las transacciones del cliente');
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
