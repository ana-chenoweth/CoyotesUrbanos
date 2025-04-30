const express = require('express');
const cors = require('cors');
const trafficRoute = require('./routes/traffic');

const app = express();
app.use(cors());
app.use('/api/traffic', trafficRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚦 Traffic sim running on port ${PORT}`));
