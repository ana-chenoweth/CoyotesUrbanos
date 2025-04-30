function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateTrafficDensity({ hour = 12, zoneType = "urban" }) {
    const peakMultiplier = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 1.5 : 1;
    const zoneMultiplier = zoneType === "urban" ? 1.2 : 0.8;
  
    const flow = getRandomInt(300, 1800) * peakMultiplier * zoneMultiplier;
    const speed = getRandomFloat(30, 90);
    const density = (flow / speed) * getRandomFloat(0.95, 1.05);
  
    return {
      hour,
      zoneType,
      flow: Math.round(flow),
      speed: speed.toFixed(1),
      density: density.toFixed(2),
      trafficLevel: density > 50 ? "high" : density > 20 ? "medium" : "low"
    };
  }
  
  module.exports = generateTrafficDensity;
  