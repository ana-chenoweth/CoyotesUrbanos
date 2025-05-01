window.onload = function () {
  const map = document.getElementById("mapCanvas");
  map.width = 200;
  map.height = window.innerHeight;

  const ctx = map.getContext("2d");
  const road = new Road(map.width / 2, map.width * 0.9);
  
  // Main car (AI)
  const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3, "green");

  // Simulation mode (AI or fixed)
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "ai";

  // Determine traffic conditions
  const levels = ["low", "medium", "high"];
  const trafficLevel = levels[Math.floor(Math.random() * levels.length)];
  trafficData = { trafficLevel };

  switch (trafficLevel) {
    case "high":
      carSpawnRate = 0.9;
      break;
    case "medium":
      carSpawnRate = 0.5;
      break;
    case "low":
      carSpawnRate = 0.2;
      break;
  }


  console.log(`🚗 Mode: ${mode.toUpperCase()} - Traffic Level: ${trafficData.trafficLevel.toUpperCase()}`);

  const traffic = [];
  const laneCount = road.laneCount;
  const carCount = Math.floor(carSpawnRate * 20);

  for (let i = 0; i < carCount; i++) {
    const lane = Math.floor(Math.random() * laneCount);
    const y = car.y + 200 + Math.random() * 1000; // Staggered randomly below AI car
    const color = ["blue", "red", "orange", "gray", "purple"][i % 5];

    const dummy = new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", 2, color);
    traffic.push(dummy);
  }

  const lights = [];
  const lightSpacing = 400;
  const numberOfLights = 8;

  for (let i = 1; i <= numberOfLights; i++) {
    const y = -i * lightSpacing;

    for (let lane = 0; lane < road.laneCount; lane++) {
      lights.push(new TrafficLight(
        road.getLaneCenter(lane),
        y,
        3000 + Math.random() * 2000,
        3000 + Math.random() * 2000,
        Math.random() < 0.5 // randomly start green/red
      ));
    }
  }

  

  // Info UI
  const infoBox = document.createElement("div");
  infoBox.style.position = "absolute";
  infoBox.style.top = "10px";
  infoBox.style.left = "10px";
  infoBox.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
  infoBox.style.padding = "8px";
  infoBox.style.fontFamily = "monospace";
  infoBox.style.fontSize = "14px";
  infoBox.style.zIndex = "1000";
  infoBox.innerText = `Mode: ${mode.toUpperCase()}\nTraffic: ${trafficData.trafficLevel.toUpperCase()}`;
  infoBox.innerText = `Mode: ${mode.toUpperCase()}
  Traffic: ${trafficData.trafficLevel.toUpperCase()}
  Cars: ${carCount}`;

  document.body.appendChild(infoBox);

  // Animation loop
  function animate() {
    map.width = window.innerWidth * 0.95;
    map.height = 300; // short and wide
  
    traffic.forEach(c => c.update(road.borders, traffic, lights));
    car.update(road.borders, traffic, lights);
    lights.forEach(light => light.update());

    ctx.save();
    ctx.translate(map.width / 2, map.height / 2); // center canvas
    ctx.rotate(-Math.PI / 2);                     // rotate canvas left (90° CCW)
    ctx.translate(-car.y, -map.width / 2);        // adjust for scrolling



    // 🖼️ Background
    ctx.fillStyle = "#eaeaea";
    ctx.fillRect(-1000, -10000, 2000, 20000);

    // 🚗 Road and vehicles
    road.draw(ctx);
    traffic.forEach(c => c.draw(ctx));
    car.draw(ctx);

    // ✅ ✅ Draw lights here again (in world space!)
    lights.forEach(light => light.draw(ctx));

    ctx.restore();

    requestAnimationFrame(animate);
}

console.log(`🚘 DUMMY cars spawned: ${traffic.length}`);
traffic.forEach(c => c.update(road.borders, traffic, lights));
console.log(`Speed of dummy[0]: ${traffic[0]?.speed.toFixed(2)}`);
console.log(`Dummy Y pos: ${traffic[0].y.toFixed(1)}, speed: ${traffic[0].speed.toFixed(1)}`);
console.log(`Dummy[0]: y=${traffic[0].y.toFixed(1)} speed=${traffic[0].speed.toFixed(1)}`);

  animate();
};
