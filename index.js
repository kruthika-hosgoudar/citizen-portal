require('dotenv').config();
const express = require('express');
const cors= require('cors');
const pool = require('./db'); // Connects to our database

const app = express();
app.use(cors());
app.use(express.json()); // Essential: Allows our server to read JSON data sent by users

const PORT = process.env.PORT || 5000;

// 1. Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the Secure Citizen Portal API!');
});

// 2. Citizen Registration Route (POST Request)
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, phone_number } = req.body;

    // Safety Check: Ensure no fields are empty
    if (!full_name || !email || !phone_number) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Secure SQL Query using Parameterized Queries ($1, $2, $3) 
    // This completely prevents SQL Injection attacks!
    const queryText = `
      INSERT INTO citizens (full_name, email, phone_number) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const values = [full_name, email, phone_number];

    // Execute the query
    const newCitizen = await pool.query(queryText, values);

    // Respond back to the user with a success message
    res.status(201).json({
      message: "Citizen registered successfully!",
      citizen: newCitizen.rows[0]
    });

  } catch (error) {
    console.error("Database Error:", error.message);
    
    // Check if the error is due to an email that already exists
    if (error.code === '23505') {
      return res.status(400).json({ error: "This email is already registered!" });
    }
    
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// 4. File a New Complaint Route (POST Request)
app.post('/api/complaints', async (req, res) => {
  try {
    const { citizen_id, title, description } = req.body;

    // Safety check: Ensure no empty inputs
    if (!citizen_id || !title || !description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const queryText = `
      INSERT INTO complaints (citizen_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [citizen_id, title, description];

    const newComplaint = await pool.query(queryText, values);

    res.status(201).json({
      message: "Complaint registered successfully!",
      complaint: newComplaint.rows[0]
    });

  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// // 5. Get All Complaints with Citizen Details (GET Request with JOIN)
app.get('/api/complaints-detailed', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        complaints.id AS complaint_id,
        complaints.title,
        complaints.description,
        complaints.status,
        citizens.full_name AS citizen_name,
        citizens.email AS citizen_email
      FROM complaints
      INNER JOIN citizens ON complaints.citizen_id = citizens.id;
    `;
    
    const result = await pool.query(queryText);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// 6. Delete a Specific Complaint Route (DELETE Request)
app.delete('/api/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Execute the SQL DELETE query
    const deleteOp = await pool.query('DELETE FROM complaints WHERE id = $1 RETURNING *;', [id]);

    // Safety Check: If the rows array is empty, the complaint ID wasn't found
    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ error: "Complaint not found!" });
    }

    res.status(200).json({
      message: `Complaint ID ${id} deleted successfully!`,
      deletedComplaint: deleteOp.rows[0]
    });

  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});