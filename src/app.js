const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',        // Cambia esto por tu usuario de MySQL
    password: 'tu_contraseña',  // Cambia esto por tu contraseña de MySQL
    database: 'sistema_cartas'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta para agregar empleados
app.post('/agregar-empleado', (req, res) => {
    const { nombre, puesto, numero_identificacion, equipo_id } = req.body;
    db.query('INSERT INTO empleados (nombre, puesto, numero_identificacion, equipo_id) VALUES (?, ?, ?, ?)', 
    [nombre, puesto, numero_identificacion, equipo_id], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al agregar el empleado.');
        }
        res.redirect('/');
    });
});

// Ruta para agregar equipos
app.post('/agregar-equipo', (req, res) => {
    const { marca, modelo, numero_serie } = req.body;
    db.query('INSERT INTO equipos (marca, modelo, numero_serie) VALUES (?, ?, ?)', 
    [marca, modelo, numero_serie], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al agregar el equipo.');
        }
        res.redirect('/');
    });
});

// Ruta para generar carta
app.get('/carta/:id', (req, res) => {
    const empleadoId = req.params.id;
    db.query('SELECT e.*, eq.* FROM empleados e LEFT JOIN equipos eq ON e.equipo_id = eq.id WHERE e.id = ?', [empleadoId], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al obtener el empleado.');
        }
        const empleado = results[0];
        res.render('carta', { empleado });
    });
});

// Ruta para ver todos los empleados
app.get('/', (req, res) => {
    db.query('SELECT * FROM empleados', (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al obtener empleados.');
        }
        res.render('index', { empleados: results });
    });
});

// Ruta para ver todos los equipos
app.get('/equipos', (req, res) => {
    db.query('SELECT * FROM equipos', (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error al obtener equipos.');
        }
        res.render('equipos', { equipos: results });
    });
});

app.listen(3000, () => {
    console.log('Servidor en funcionamiento en http://localhost:3000');
});
