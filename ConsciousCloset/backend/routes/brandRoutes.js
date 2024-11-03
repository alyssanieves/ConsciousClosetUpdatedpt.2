// backend/routes/brandRoutes.js
module.exports = (db) => {
    const express = require('express');
    const router = express.Router();
  
    // Get all brands
    router.get('/', (req, res) => {
      db.all('SELECT * FROM brands', (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ data: rows });
      });
    });
  
    
    router.post('/', (req, res) => {
      const { name, description, sustainability_score, website_url } = req.body;
      db.run(
        `INSERT INTO brands (name, description, sustainability_score, website_url) VALUES (?, ?, ?, ?)`,
        [name, description, sustainability_score, website_url],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Brand added successfully', id: this.lastID });
        }
      );
    });
  
    return router;
  };
  