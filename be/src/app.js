import cors from 'cors';
import express from 'express';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.HTTP_PORT || 4000;

app.use(cors(
  {
    origin: 'https://carrotfe10011341.fly.dev',
    credentials: true,
    exposedHeaders: ['authorization'],
  }
));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

export default app;
