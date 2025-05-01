import { useEffect, useState } from 'react';

function TrafficMap() {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleMapsAPILoaded, setGoogleMapsAPILoaded] = useState(false);

  const endpoint = '/api/traffic/density?hour=14&zone=urban';

  const googleMapsScriptUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAqIc5m9TzYKt7pWkU16uoGV13wJiGyAX4&libraries=places`;

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = googleMapsScriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleMapsAPILoaded(true);
    document.head.appendChild(script);
  };
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setTrafficData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching traffic data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (googleMapsAPILoaded && trafficData) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: -23.5505, lng: -46.6333 }, // Example coordinates
        zoom: 12,
      });

      const marker = new window.google.maps.Marker({
        position: { lat: -23.5505, lng: -46.6333 },
        map,
        title: `Traffic: ${trafficData.trafficLevel}`,
      });

      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);
    }
  }, [googleMapsAPILoaded, trafficData]);

  if (loading) return <p>Loading traffic data...</p>;

  return (
    <div>
      <h2>
        Traffic at {trafficData.hour}:00 in {trafficData.zoneType} zone
      </h2>
      <ul>
        <li>Flow: {trafficData.flow} vehicles/hour</li>
        <li>Speed: {trafficData.speed} km/h</li>
        <li>Density: {trafficData.density} vehicles/km</li>
        <li>Traffic Level: {trafficData.trafficLevel}</li>
      </ul>
      <div
        id="map"
        style={{
          width: '100%',
          height: '400px',
          marginTop: '1rem',
        }}
      ></div>
    </div>
  );
}

export default TrafficMap;
