import express from "express";
import cors from "cors";
import subjectRouter from "./routes/subjects.route";
import "dotenv/config";

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) {
    console.warn("Warning: FRONTEND_URL is not set. CORS may allow any origin.");
}

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, welcome to the Classroom API");
});

app.use('/api/subjects', subjectRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});