import express from 'express';
import jwt from 'jsonwebtoken';
import db from './db.js';
import fetch from 'node-fetch';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, error: 'No token' });

  try {
    const token = auth.replace('Bearer ', '');
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid token', secret:JWT_SECRET });
  }
}

async function verifyCaptcha(token) {
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token
    })
  });
  return response.json();
}

function sanitize(str) {
  return String(str).trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

router.post('/mensajes', verifyToken, async (req, res) => {
  const { nombre, correo, asunto, telefono, descripcion, edad, captchaToken } = req.body;

  if (!captchaToken) return res.status(400).json({ success: false, error: 'Captcha requerido' });

  const captcha = await verifyCaptcha(captchaToken);
  if (!captcha.success || captcha.score < 0.5)
    return res.status(400).json({ success: false, error: 'Captcha inválido' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const safeData = {
    nombre: sanitize(nombre),
    correo: sanitize(correo),
    asunto: sanitize(asunto),
    telefono: sanitize(telefono),
    descripcion: sanitize(descripcion),
    edad: parseInt(edad)
  };

  if (
    !safeData.nombre || !safeData.correo || !safeData.asunto || !safeData.telefono ||
    safeData.descripcion == null || isNaN(safeData.edad)
  ) {
    return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios y válidos' });
  }

  if (!emailRegex.test(safeData.correo)) {
    return res.status(400).json({ success: false, error: 'Correo inválido' });
  }

  try {
    const result = await db.query(`
      INSERT INTO mensajes (nombre, correo, asunto, telefono, descripcion, edad)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      Object.values(safeData)
    );
    res.status(201).json({ success: true, mensaje: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error en la base de datos' });
  }
});

router.get('/mensajes', verifyToken, async (req, res) => {
  const query = req.query;

  try {
    let sql = 'SELECT * FROM mensajes WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    const filterableFields = ['nombre', 'correo', 'asunto', 'telefono', 'descripcion'];
    const numericFields = ['edad'];

    for (const field of filterableFields) {
      if (query[field]) {
        sql += ` AND ${field} ILIKE $${paramIndex}`;
        params.push(`%${query[field]}%`);
        paramIndex++;
      }
    }

    for (const field of numericFields) {
      if (query[`${field}_min`]) {
        sql += ` AND ${field} >= $${paramIndex}`;
        params.push(Number(query[`${field}_min`]));
        paramIndex++;
      }
      if (query[`${field}_max`]) {
        sql += ` AND ${field} <= $${paramIndex}`;
        params.push(Number(query[`${field}_max`]));
        paramIndex++;
      }
    }

    const result = await db.query(sql, params);
    res.json({ success: true, mensajes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener mensajes' });
  }
});

router.get('/mensajes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM mensajes WHERE id = $1', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
    }
    res.json({ success: true, mensaje: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al obtener mensaje' });
  }
});


router.put('/mensajes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, asunto, telefono, descripcion, edad } = req.body;

  if (
    nombre == null || correo == null || asunto == null || telefono == null ||
    descripcion == null || edad == null
  ) {
    return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await db.query(`
      UPDATE mensajes SET
        nombre = $1, correo = $2, asunto = $3,
        telefono = $4, descripcion = $5, edad = $6
      WHERE id = $7
      RETURNING *`,
      [nombre, correo, asunto, telefono, descripcion, edad, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
    }

    res.json({ success: true, mensaje: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al actualizar mensaje' });
  }
});

router.delete('/mensajes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM mensajes WHERE id = $1 RETURNING *', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
    }

    res.json({ success: true, mensaje: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al eliminar mensaje' });
  }
});

export default router;
