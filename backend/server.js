import express from 'express';
import cors from 'cors';
import { configDotenv } from "dotenv";
configDotenv();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

const Port = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

import patientRoute from './routes/patientRoute.js';
app.use('/api/v1/patient', patientRoute);