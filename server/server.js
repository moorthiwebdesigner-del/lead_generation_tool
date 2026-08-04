const express = require("express");
const cors = require("cors");
const db = require("./db");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Lead Generation Tool API is Running 🚀",
  });
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "lead_generation_secret",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login Success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});


/*
GET /api/search?query=Restaurant&city=Chennai
*/

app.get("/api/search", async (req, res) => {
  try {
    const { query, city } = req.query;

    if (!query || !city) {
      return res.status(400).json({
        error: "query and city are required",
      });
    }

    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: `${query} in ${city}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.rating,places.websiteUri,places.nationalPhoneNumber",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to fetch places",
      details: error.response?.data || error.message,
    });
  }
});


app.post("/api/save-lead", async (req, res) => {
  try {
    const {
      business_name,
      phone,
      website,
      rating,
      address,
    } = req.body;

    const check = await db.query(
      `SELECT id
       FROM saved_leads
       WHERE business_name = $1
       AND phone = $2`,
      [business_name, phone]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        message: "Lead already saved",
      });
    }

    await db.query(
      `INSERT INTO saved_leads
      (business_name, phone, website, rating, address, status)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        business_name,
        phone,
        website,
        rating,
        address,
        "New",
      ]
    );

    res.json({
      message: "Lead Saved Successfully ✅",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

app.get("/api/saved-leads", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT *
      FROM saved_leads
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });

  }
});

app.delete("/api/saved-leads/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM saved_leads WHERE id = $1",
      [id]
    );

    res.json({
      message: "Lead Deleted Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Delete Failed",
    });

  }
});

const { Parser } = require("json2csv");

app.get("/api/export-csv", async (req, res) => {
  try {

    const result = await db.query(
      "SELECT * FROM saved_leads"
    );

    const fields = [
      "business_name",
      "phone",
      "website",
      "rating",
      "address",
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(result.rows);

    res.header("Content-Type", "text/csv");
    res.attachment("saved_leads.csv");

    res.send(csv);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });

  }
});

app.get("/api/dashboard-stats", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT
        COUNT(*)::int AS "totalLeads",

        COUNT(*) FILTER (
          WHERE DATE(created_at) = CURRENT_DATE
        )::int AS "todayLeads",

        COALESCE(AVG(rating),0) AS "avgRating",

        COUNT(*) FILTER (WHERE status='New')::int AS "newLeads",

        COUNT(*) FILTER (WHERE status='Contacted')::int AS "contactedLeads",

        COUNT(*) FILTER (WHERE status='Qualified')::int AS "qualifiedLeads",

        COUNT(*) FILTER (WHERE status='Proposal')::int AS "proposalLeads",

        COUNT(*) FILTER (WHERE status='Won')::int AS "wonLeads",

        COUNT(*) FILTER (WHERE status='Lost')::int AS "lostLeads"

      FROM saved_leads
    `);

    const data = result.rows[0];

    res.json({
      totalLeads: data.totalLeads,
      todayLeads: data.todayLeads,
      avgRating: Number(data.avgRating).toFixed(1),

      newLeads: data.newLeads,
      contactedLeads: data.contactedLeads,
      qualifiedLeads: data.qualifiedLeads,
      proposalLeads: data.proposalLeads,
      wonLeads: data.wonLeads,
      lostLeads: data.lostLeads,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });

  }
});

app.get("/api/search-saved", async (req, res) => {
  try {

    const { keyword } = req.query;

    const search = `%${keyword}%`;

    const result = await db.query(
      `SELECT *
       FROM saved_leads
       WHERE business_name ILIKE $1
          OR phone ILIKE $2
          OR address ILIKE $3
       ORDER BY created_at DESC`,
      [search, search, search]
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });

  }
});

app.put("/api/update-lead/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      notes,
      followup_date,
    } = req.body;

    await db.query(
      `UPDATE saved_leads
       SET status=$1,
           notes=$2,
           followup_date=$3
       WHERE id=$4`,
      [status, notes, followup_date, id]
    );

    res.json({
      message: "Lead Updated Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update Failed",
    });

  }
});

app.get("/api/today-followups", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT
        id,
        business_name,
        phone,
        status,
        notes,
        followup_date
      FROM saved_leads
      WHERE followup_date = CURRENT_DATE
      ORDER BY followup_date ASC
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error"
    });

  }
});

app.get("/api/analytics", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT
        status,
        COUNT(*)::int AS total
      FROM saved_leads
      GROUP BY status
      ORDER BY status
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Database Error",
    });

  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});