import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export const getTickets = (params) => API.get("/tickets", { params });
export const getTicket = (ticketId) => API.get(`/tickets/${ticketId}`);
export const createTicket = (data) => API.post("/tickets", data);
export const updateTicket = (ticketId, data) => API.put(`/tickets/${ticketId}`, data);
export const deleteTicket = (ticketId) => API.delete(`/tickets/${ticketId}`);
export const getStats = () => API.get("/tickets/stats");

export default API;
