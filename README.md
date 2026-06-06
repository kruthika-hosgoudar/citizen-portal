# 🏛️ Secure Citizen Portal (Full-Stack)

A complete full-stack civic application designed to allow local citizens to register profiles and log community complaints (e.g., broken streetlights, water leakages) directly onto a central dashboard. Built with a relational database backend and an interactive frontend interface.

---

## 🚀 Features

- **Citizen Registration:** Add new citizen profiles securely into the database.
- **Dynamic Complaint Logging:** File structural complaints linked directly to a unique citizen profile.
- **Relational Dashboard:** View active complaints alongside the name and contact info of the citizen who filed them using **SQL INNER JOINs**.
- **Real-Time Deletion:** Remove resolved or pending complaints instantly from the UI and database.
- **CORS Enabled:** Seamless cross-origin data fetching between the frontend and backend.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Relational DB)
- **API Testing:** Thunder Client (VS Code)
- **Version Control:** Git & GitHub

---

## 📋 Database Architecture

The project utilizes two relational tables linked via a **Foreign Key** (`1:M` relationship):

### 1. `citizens` Table
- `id` (SERIAL, Primary Key)
- `full_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `phone_number` (VARCHAR)

### 2. `complaints` Table
- `id` (SERIAL, Primary Key)
- `citizen_id` (INT, References `citizens(id)` ON DELETE CASCADE)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (VARCHAR, Default: 'Pending')
- `created_at` (TIMESTAMP)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/kruthika-hosgoudar/citizen-portal.git
cd citizen-portal