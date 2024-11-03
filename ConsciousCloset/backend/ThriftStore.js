const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// Endpoint to find thrift stores by location (GET)
router.get('/', (req, res) => {
    const { location } = req.query; 

    if (!location) {
        return res.status(400).json({ error: 'Location is required.' });
    }

    // SQL query to fetch thrift stores based on location
    db.all(`SELECT * FROM thrift_stores WHERE address LIKE ?`, [`%${location}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No thrift stores found for the specified location.' });
        }

        res.json({ success: true, data: rows });
    });
});

// Endpoint to add a thrift store (POST)
router.post('/', (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required.' });
    }

   
    db.run(`INSERT INTO thrift_stores (name, address) VALUES (?, ?)`, [name, address], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.status(201).json({ success: true, id: this.lastID });
    });
});

// 404 route for thrift store API
router.use((req, res) => {
    res.status(404).json({ error: 'Thrift store route not found' });
});

module.exports = router; 
