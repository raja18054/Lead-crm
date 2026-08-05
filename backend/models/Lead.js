const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      unique: true,
      // auto-generated in pre-save hook below, not required from client
    },
    customer_name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customer_email: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    notes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // gives you createdAt, updatedAt automatically
);

// Auto-generate ticket_id before saving (e.g. TKT-001, TKT-002...)
ticketSchema.pre("save", async function (next) {
  if (!this.ticket_id) {
    const count = await mongoose.model("Ticket").countDocuments();
    this.ticket_id = `TKT-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
