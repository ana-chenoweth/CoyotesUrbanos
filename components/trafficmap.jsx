import { useEffect, useState } from 'react';

function TrafficMap() {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual production backend later
  const endpoint = '/api/traffic/density?hour=14&zone=urban';

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setTrafficData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching traffic data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (window.google && trafficData) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo example
        zoom: 12
      });

      new window.google.maps.Marker({
        position: { lat: -23.5505, lng: -46.6333 },
        map,
        title: `Traffic: ${trafficData.trafficLevel}`
      });
    }
  }, [trafficData]);

  if (loading) return <p>Loading traffic data...</p>;

  return (
    <div>
      <h2>Traffic at {trafficData.hour}:00 in {trafficData.zoneType} zone</h2>
      <ul>
        <li>Flow: {trafficData.flow} vehicles/hour</li>
        <li>Speed: {trafficData.speed} km/h</li>
        <li>Density: {trafficData.density} vehicles/km</li>
        <li>Traffic Level: {trafficData.trafficLevel}</li>
      </ul>
      <div id="map" style={{ width: '100%', height: '400px', marginTop: '1rem' }}></div>
    </div>
  );
}

export default TrafficMap;
