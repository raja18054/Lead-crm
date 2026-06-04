const Lead = require("../models/Lead");

exports.getLeads = async (req, res) => {
  try {
    const { search, status, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ leads, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A lead with this email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const byStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusMap = { New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 };
    byStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });
    const conversionRate = total > 0 ? ((statusMap.Converted / total) * 100).toFixed(1) : 0;
    res.json({ total, byStatus: statusMap, conversionRate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
