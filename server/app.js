import express from "express";
import cors from "cors";
import expenseRoutes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/expenses", expenseRoutes);

export default app;