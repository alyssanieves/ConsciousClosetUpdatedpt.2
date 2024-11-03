const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const thriftRoutes = require('./ThriftStore'); // Ensure this is correct
const axios = require('axios'); // Add axios for making HTTP requests
const cheerio = require('cheerio'); // Add cheerio for parsing HTML

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes for thrift stores
app.use('/api/thrift-stores', thriftRoutes);

// Endpoint to check sustainability
app.get('/api/check-sustainability', async (req, res) => {
    const { url } = req.query;

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

       
        const sustainabilityInfo = [
            $('meta[name="description"]').attr('content'),
            $('h1').text(),
            $('h2').text(),
            $('p').text(), 
            $('div.sustainability-info').text(), 
        ].join(' '); 

        // Basic sustainability assessment logic
        let rating = 0;
        let message = '';
        let isEthical = false;
        let details = [];

        // Check for sustainability indicators
        if (sustainabilityInfo) {
            if (sustainabilityInfo.toLowerCase().includes('sustainable') || sustainabilityInfo.toLowerCase().includes('eco-friendly')) {
                rating = 5;
                message = 'This brand is considered Ethical.';
                details.push('The brand is committed to sustainability and eco-friendly practices, focusing on reducing environmental impact.');
                isEthical = true;
            } else if (sustainabilityInfo.toLowerCase().includes('ethical') || sustainabilityInfo.toLowerCase().includes('responsible')) {
                rating = 4;
                message = 'This brand is considered Ethical.';
                details.push('The brand follows ethical practices in its supply chain and production, ensuring fair treatment of workers and responsible sourcing.');
                isEthical = true;
            } else if (sustainabilityInfo.toLowerCase().includes('transparency')) {
                rating = 3;
                message = 'This brand is somewhat Ethical.';
                details.push('The brand is transparent about its practices, which helps consumers make informed decisions. However, transparency does not necessarily equate to high sustainability standards.');
                isEthical = true;
            } else if (sustainabilityInfo.toLowerCase().includes('recycled') || sustainabilityInfo.toLowerCase().includes('organic')) {
                rating = 2;
                message = 'This brand has some Ethical aspects.';
                details.push('The brand uses some sustainable materials like recycled or organic fabrics, but it may lack a comprehensive approach to sustainability and ethical practices.');
            } else {
                rating = 1;
                message = 'This brand is not considered Ethical.';
                details.push('The brand does not provide clear information about its sustainability efforts or ethical practices.');
            }



            // Additional checks for more detailed sustainability aspects
            if (sustainabilityInfo.toLowerCase().includes('water usage') || sustainabilityInfo.toLowerCase().includes('water consumption')) {
                details.push('This brand makes efforts to reduce water usage in its production processes, contributing to water conservation.');
            }

            if (sustainabilityInfo.toLowerCase().includes('carbon footprint') || sustainabilityInfo.toLowerCase().includes('emissions')) {
                details.push('The brand is actively working to lower its carbon footprint through practices like reducing emissions during manufacturing.');
            }

            if (sustainabilityInfo.toLowerCase().includes('fair labor') || sustainabilityInfo.toLowerCase().includes('fair trade') || sustainabilityInfo.toLowerCase().includes('worker welfare')) {
                details.push('The brand prioritizes fair labor practices, ensuring that workers are treated fairly and paid adequately.');
            }

            if (sustainabilityInfo.toLowerCase().includes('renewable energy')) {
                details.push('This brand invests in renewable energy sources, which helps reduce its reliance on fossil fuels and minimize its environmental impact.');
            }

            if (sustainabilityInfo.toLowerCase().includes('biodegradable') || sustainabilityInfo.toLowerCase().includes('compostable')) {
                details.push('The brand uses biodegradable or compostable materials, helping to minimize waste and pollution.');
            }

            // Add a generic message if only one detail is found
            if (details.length === 1) {
                details.push('No further specific sustainability practices were mentioned.');
            }
        } else {
            rating = 1;
            message = 'This brand is not considered Ethical.';
            details.push('No sustainability or ethical information was found for this brand, making it impossible to determine its practices.');
            isEthical = false;
        }

        // Send the response with detailed information
        res.json({ rating, message, details: details.join(' '), isEthical });
    } catch (error) {
        console.error('Error fetching the website:', error);
        res.status(500).json({ message: 'Error fetching the website.' });
    }
});

// Default route for serving the main HTML page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 404 route for handling undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
