const express = require('express');
const cors = require('cors');
const trafficRoute = require('./routes/traffic');
const path = require('path');

const app = express();
app.use(cors());
app.use('/api/traffic', trafficRoute);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚦 Traffic sim running on port ${PORT}`));
