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


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database Error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

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
      "lead_generation_secret",
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
  });
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


app.post("/api/save-lead", (req, res) => {
  const {
    business_name,
    phone,
    website,
    rating,
    address,
  } = req.body;

  const sql = `
    INSERT INTO saved_leads
    (business_name, phone, website, rating, address)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [business_name, phone, website, rating, address],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database Error",
        });
      }

      res.json({
        message: "Lead Saved Successfully ✅",
      });
    }
  );
});

app.get("/api/saved-leads", (req, res) => {
  const sql = `
    SELECT *
    FROM saved_leads
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json(results);
  });
});

app.delete("/api/saved-leads/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM saved_leads WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Delete Failed",
      });
    }

    res.json({
      message: "Lead Deleted Successfully",
    });
  });
});

const { Parser } = require("json2csv");

app.get("/api/export-csv", (req, res) => {
  const sql = "SELECT * FROM saved_leads";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database Error",
      });
    }

    const fields = [
      "business_name",
      "phone",
      "website",
      "rating",
      "address",
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(results);

    res.header("Content-Type", "text/csv");
    res.attachment("saved_leads.csv");

    return res.send(csv);
  });
});

app.get("/api/dashboard-stats", (req, res) => {
  const stats = {};

  db.query(
    "SELECT COUNT(*) AS total FROM saved_leads",
    (err, totalResult) => {
      if (err) return res.status(500).json(err);

      stats.totalLeads = totalResult[0].total;

      db.query(
        "SELECT COUNT(*) AS today FROM saved_leads WHERE DATE(created_at)=CURDATE()",
        (err, todayResult) => {
          if (err) return res.status(500).json(err);

          stats.todayLeads = todayResult[0].today;

          db.query(
            "SELECT AVG(rating) AS rating FROM saved_leads",
            (err, ratingResult) => {
              if (err) return res.status(500).json(err);

              stats.avgRating =
                Number(ratingResult[0].rating || 0).toFixed(1);

              res.json(stats);
            }
          );
        }
      );
    }
  );
});

app.get("/api/search-saved", (req, res) => {
  const { keyword } = req.query;

  const sql = `
    SELECT *
    FROM saved_leads
    WHERE business_name LIKE ?
       OR phone LIKE ?
       OR address LIKE ?
    ORDER BY created_at DESC
  `;

  const search = `%${keyword}%`;

  db.query(sql, [search, search, search], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json(results);
  });
});

app.put("/api/update-lead/:id", (req, res) => {
  const { id } = req.params;

  const {
    status,
    notes,
    followup_date,
  } = req.body;

  const sql = `
    UPDATE saved_leads
    SET
      status = ?,
      notes = ?,
      followup_date = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [status, notes, followup_date, id],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Update Failed",
        });
      }

      res.json({
        message: "Lead Updated Successfully"
      });
    }
  );
});

app.get("/api/today-followups", (req, res) => {

  const sql = `
    SELECT
      id,
      business_name,
      phone,
      status,
      notes,
      followup_date
    FROM saved_leads
    WHERE followup_date = CURDATE()
    ORDER BY followup_date ASC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json({
        message: "Database Error"
      });
    }

    res.json(results);

  });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});