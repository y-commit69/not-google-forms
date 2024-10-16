import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/api", (req, res) => {
  res.json({ users: [{ name: "shrek" }, { name: "fiona" }] });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
