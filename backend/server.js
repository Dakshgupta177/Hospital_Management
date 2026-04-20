import express from 'express';
import cors from 'cors';
import { configDotenv } from "dotenv";
configDotenv();
const app = express();

const corsOptions = {
  origin: [
    'https://hospital-management-1-uvx8.onrender.com',
    'https://hospital-management-1-uvx8.onrender.com/'
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors(corsOptions));

const Port = process.env.PORT || 5000;

await initDB();

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

import patientRoute from './routes/patientRoute.js';
import doctorRoute from './routes/doctorRoute.js';
import appointmentRoute from './routes/appointmentRoute.js';
import testRoute from './routes/testRoute.js';
import billingRoute from './routes/billingRoute.js';
import initDB from './db/initDB.js';

app.use('/api/v1/patient', patientRoute);
app.use('/api/v1/appointment', appointmentRoute);
app.use('/api/v1/doctor', doctorRoute);
app.use('/api/v1/test', testRoute);
app.use('/api/v1/billing', billingRoute);
