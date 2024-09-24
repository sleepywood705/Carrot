import cors from 'cors';
import express from 'express';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.HTTP_PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['authorization'],
  }));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

// // 작성: 미열
// import mongoose from "mongoose";

// mongoose
//   .connect(process.env.DB, {
//     user: "admin",
//     pass: "admin",
//     authSource: "admin",
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   })
//   .then(() => console.log("몽고DB에 연결되었어요!"));

export default app;
