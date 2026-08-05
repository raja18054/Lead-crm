const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getStats,
} = require("../controllers/ticketController");

router.get("/stats", getStats);
router.get("/", getTickets);
router.get("/:ticket_id", getTicket);
router.post("/", createTicket);
router.put("/:ticket_id", updateTicket);
router.delete("/:ticket_id", deleteTicket);

module.exports = router;;
