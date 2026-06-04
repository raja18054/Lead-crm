# Lead Management CRM

A full-stack Lead Management CRM built with React, Node.js/Express, and MongoDB.

## Features
- Add, view, edit, and delete leads
- Lead status tracking: New → Contacted → Qualified → Converted / Lost
- Search leads by name, email, or company
- Filter by status, sort by any column
- Pagination, Stats dashboard

## Tech Stack
- Frontend: React.js, Axios
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)

## Setup

### Backend
cd backend
npm install
cp .env.example .env
npm run dev

### Frontend
cd frontend
npm install
npm start

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leads | Get all leads |
| GET | /api/leads/stats | Get statistics |
| POST | /api/leads | Create lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |

## Author
Raja Chauhan — github.com/raja18054
