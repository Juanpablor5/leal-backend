const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../keys')

const pool = require('../database');
const tools = require('../lib/tools');

// Dar todos los usuarios registrados
router.get('/get', async (req, res) => {
    const users = await pool.query('SELECT user_id, name, lastname, email FROM user');
    if (users.length === 0) {
        console.log("No hay usuarios registrados")
        res.send({
            message: "No hay usuarios registrados"
        })
    } else {
        res.status(200).json(users);
    }
});

// Registar un usuario
router.post('/signup', async (req, resp) => {
    const processData = tools.process(req.body.email, req.body.birth_date, req.body.password);

    let userData = {
        user_id: processData.usrid,
        name: req.body.name,
        lastname: req.body.lastname,
        birth_date: processData.form_date,
        email: req.body.email,
        password: processData.pswd
    }

    await pool.query('INSERT INTO user set ?', [userData], (err, res) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                resp.status(409).json({
                    success: false,
                    message: "El usuario ya está registrado"
                });
                return console.error('El usuario ya está registrado')
            } else {
                resp.status(500).json({
                    success: false,
                    message: "Error"
                });
            }
        } else {
            resp.status(200).json({
                user_id: userData.user_id,
                name: userData.name,
                lastname: userData.lastname,
                email: userData.email
            })
        }

    });
});

// Iniciar sesión
router.post('/login', async (req, res) => {
    const auth = tools.authenticate(req.body.email, req.body.password);
    let userData = {
        user_id: auth.usrid,
        password: auth.pswd
    }

    const checkUsr = await pool.query('SELECT * FROM user WHERE user_id = ?', [userData.user_id]);
    if (checkUsr.length === 0) {
        return res.status(404).json({
            message: "El usuario no existe"
        })
    }

    const user = await pool.query('SELECT * FROM user WHERE user_id = ? AND password = ?', [userData.user_id, userData.password]);

    if (user.length == 0) {
        return res.status(401).json({
            auth: false,
            token: null,
            message: "Contraseña incorrecta"
        })
    }
    const token = jwt.sign({ user_id: auth.usrid }, secret, {
        expiresIn: 60 * 60 * 24
    });
    res.json({
        auth: true,
        token,
        user
    })
});

// Registrar transacción del usuario con sesión iniciada
router.post('/transactions', tools.verifyToken, async (req, resp, next) => {
    let points = parseInt(req.body.value / 1000);

    let transaction = {
        value: req.body.value,
        points: points,
        status: 1,
        user_id: req.user_id
    }

    await pool.query('INSERT INTO transaction set ?', [transaction], (err, res) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: "Error",
                errorType: err.code
            });
        } else {
            resp.status(200).json(transaction)
        }

    });
});

// Ver historial de transacciones del usuario con sesión iniciada
router.get('/transactions', tools.verifyToken, async (req, res, next) => {
    const transactions = await pool.query('SELECT * FROM transaction WHERE user_id = ? ORDER BY created_date DESC', [req.user_id]);
    if (transactions.length == 0) {
        return res.status(404).json({
            message: "No hay transacciones para este usuario"
        })
    }
    res.json(transactions)
});

// Ver puntos de transacciones activas del usuario con sesión iniciada
router.get('/points', tools.verifyToken, async (req, res, next) => {
    const points_history = await pool.query('SELECT points FROM transaction WHERE user_id = ? AND status = 1', [req.user_id]);
    let points = 0;

    if (points_history.length === 0) {
        res.send({
            message: "No hay transacciones para el usuario"
        })
    } else {
        points_history.forEach(pnt => {
            points += pnt.points
        });
        res.status(200).json({ points: points });
    }
});

// Inactivar transacción
router.put('/transactions/:transaction_id', tools.verifyToken, async (req, resp, next) => {
    const { transaction_id } = req.params;
    await pool.query('UPDATE transaction SET status = ? WHERE transaction_id = ? AND user_id = ?', [req.body.status, transaction_id, req.user_id], (err, res) => {
        if (res.affectedRows === 0) {
            return resp.status(404).json({
                success: false,
                message: "La transacción no existe para este usuario"
            });
        } else {
            if (err) {
                return resp.status(500).json({
                    success: false,
                    message: "Error",
                    errorType: err.code
                });
            }
            return resp.status(200).json({
                success: true,
                message: "Transacción inactiva"
            })
        }
    });
});

module.exports = router;