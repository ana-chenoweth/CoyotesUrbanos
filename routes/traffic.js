const express = require('express');
const router = express.Router();
const generateTrafficDensity = require('../services/densityGenerator');

router.get('/density', (req, res) => {
  const hour = parseInt(req.query.hour) || 12;
  const zoneType = req.query.zone || 'urban';

  const data = generateTrafficDensity({ hour, zoneType });
  res.json(data);
});

module.exports = router;
