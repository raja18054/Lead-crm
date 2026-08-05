require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const ticketRoutes = require("./routes/tickets");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => res.json({ message: "Ticket CRM API is running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
