const express = require("express");
const cors = require("cors");
console.log("MYSQLHOST =", process.env.MYSQLHOST);
console.log("MYSQLUSER =", process.env.MYSQLUSER);
console.log("MYSQLDATABASE =", process.env.MYSQLDATABASE);
console.log("MYSQLPORT =", process.env.MYSQLPORT);
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
  console.log("===== LOGIN API =====");
  console.log(req.body);

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {

    console.log("DB Error:", err);
    console.log("Results:", results);

    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    const user = results[0];

    console.log("User:", user);

    const match = await bcrypt.compare(password, user.password);

    console.log("Password Match:", match);

    if (!match) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    res.json({ message: "Success" });
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


  // Duplicate check
 const checkSql = `
  SELECT id 
  FROM saved_leads
  WHERE 
    business_name = ?
    AND phone = ?
`;


  db.query(
    checkSql,
    [business_name, phone, website],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }


      if (result.length > 0) {

        return res.status(400).json({
          message: "Lead already saved",
        });

      }


      // Insert new lead
      const sql = `
        INSERT INTO saved_leads
        (business_name, phone, website, rating, address, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;


      db.query(
        sql,
        [
          business_name,
          phone,
          website,
          rating,
          address,
          "New"
        ],
        (err) => {

          if (err) {
            return res.status(500).json({
              message:"Database Error"
            });
          }


          res.json({
            message:"Lead Saved Successfully ✅"
          });

        }
      );


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

  const sql = `
    SELECT
      COUNT(*) AS totalLeads,

      SUM(DATE(created_at)=CURDATE()) AS todayLeads,

      AVG(rating) AS avgRating,

      SUM(status='New') AS newLeads,

      SUM(status='Contacted') AS contactedLeads,

      SUM(status='Qualified') AS qualifiedLeads,

      SUM(status='Proposal') AS proposalLeads,

      SUM(status='Won') AS wonLeads,

      SUM(status='Lost') AS lostLeads

    FROM saved_leads
  `;


  db.query(sql, (err, result)=>{

    if(err){
      return res.status(500).json(err);
    }


    const data = result[0];


    res.json({

      totalLeads: data.totalLeads || 0,

      todayLeads: data.todayLeads || 0,

      avgRating:
        Number(data.avgRating || 0).toFixed(1),


      newLeads: data.newLeads || 0,

      contactedLeads: data.contactedLeads || 0,

      qualifiedLeads: data.qualifiedLeads || 0,

      proposalLeads: data.proposalLeads || 0,

      wonLeads: data.wonLeads || 0,

      lostLeads: data.lostLeads || 0,

    });

  });

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

app.get("/api/analytics", (req,res)=>{

const sql = `

SELECT 
status,
COUNT(*) as total

FROM saved_leads

GROUP BY status

`;

db.query(sql,(err,result)=>{

if(err){
 return res.status(500).json(err);
}


res.json(result);


});


});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});