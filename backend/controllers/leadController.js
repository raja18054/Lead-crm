const Ticket = require("../models/Ticket");

exports.getTickets = async (req, res) => {
  try {
    const { search, status, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: "i" } },
        { customer_email: { $regex: search, $options: "i" } },
        { ticket_id: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ tickets, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Spec wants lookup by ticket_id (e.g. TKT-001), not Mongo _id
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json({ ticket_id: ticket.ticket_id, created_at: ticket.createdAt });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Spec: PUT /api/tickets/{ticket_id} — Body: { status, notes }
exports.updateTicket = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;

    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (status) ticket.status = status;
    if (notes) ticket.notes.push(notes); // append new note, don't overwrite history

    await ticket.save();
    res.json({ success: true, updated_at: ticket.updatedAt });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const byStatus = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusMap = { Open: 0, "In Progress": 0, Closed: 0 };
    byStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });
    res.json({ total, byStatus: statusMap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
