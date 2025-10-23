import express from 'express';
import authRoutes from './routes/authRoutes'
import cors from "cors"

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const PORT = process.env.PORT || 9000;

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`SERVER is running on port ${PORT}`);
});
