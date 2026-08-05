require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const leadRoutes = require("./routes/leads");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => res.json({ message: "Lead CRM API is running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


