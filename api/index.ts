import express from 'express';
import mensajes from './src/mensajes';
import auth from './src/auth';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', auth);
app.use('/api', mensajes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
});
