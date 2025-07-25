import express from 'express';
import jwt from 'jsonwebtoken';
import db from './db';
import fetch from 'node-fetch';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

function verifyToken(req:any, res:any, next:any) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  try {
    const token = auth.replace('Bearer ', '');
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

async function verifyCaptcha(token: string) : Promise<any>{
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token
    })
  });

  return await response.json();
}

router.post('/mensajes', verifyToken, async (req, res) => {
  const { nombre, correo, asunto, telefono, descripcion, edad, captchaToken } = req.body;
  if (!captchaToken) return res.status(400).json({ error: 'Captcha requerido' });

  const captcha = await verifyCaptcha(captchaToken);
  if (!captcha?.success || captcha?.score < 0.5)
    return res.status(400).json({ error: 'Captcha inválido' });

  try {
    const result = await db.query(
      'INSERT INTO mensajes (nombre, correo, asunto, telefono, descripcion, edad) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [nombre, correo, asunto, telefono, descripcion, edad]
    );
    res.status(201).json({ mensaje: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// Otros métodos GET, PUT, DELETE similares...
export default router;
