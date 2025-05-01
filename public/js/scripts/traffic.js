window.onload = function () {
  const map = document.getElementById("mapCanvas");
  map.width = 200;
  map.height = window.innerHeight;

  const ctx = map.getContext("2d");
  const road = new Road(map.width / 2, map.width * 0.9);

  const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); // 👈 Keep this AI car!

  const trafficData = generateTrafficDensity({ hour: new Date().getHours(), zoneType: "urban" });

  let carSpawnRate;
  if (trafficData.trafficLevel === 'high') {
    carSpawnRate = 0.9;
  } else if (trafficData.trafficLevel === 'medium') {
    carSpawnRate = 0.5;
  } else {
    carSpawnRate = 0.2;
  }

  console.log(`🚗 Spawning traffic with density level: ${trafficData.trafficLevel.toUpperCase()}`);

  const traffic = [];
  const laneCount = road.laneCount;
  const carCount = Math.floor(carSpawnRate * 20); // Max 18 cars

  for (let i = 0; i < carCount; i++) {
    const lane = i % laneCount;
    const y = -100 - i * 100;
    const dummy = new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", 2, "blue");
    traffic.push(dummy);
  }

  function animate() {
    for (let i = 0; i < traffic.length; i++) {
      traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic);

    map.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -car.y + map.height * 0.7);
    road.draw(ctx);

    for (let i = 0; i < traffic.length; i++) {
      traffic[i].draw(ctx);
    }

    car.draw(ctx);
    ctx.restore();

    requestAnimationFrame(animate);
  }

  animate();
};
