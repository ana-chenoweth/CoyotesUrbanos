// intersection.js

window.onload = function () {
    const map = document.getElementById("mapCanvas");
    map.width = 800;
    map.height = 800;
  
    const ctx = map.getContext("2d");
  
    // Two roads: vertical and horizontal
    const verticalRoad = new Road(map.width / 2, map.height * 0.9);
    const horizontalRoad = new Road(map.height / 2, map.width * 0.9);
  
    // Vertical cars
    const verticalCars = [];
    for (let i = 0; i < 4; i++) {
      verticalCars.push(new Car(
        verticalRoad.getLaneCenter(i % verticalRoad.laneCount),
        800 + i * 150,
        30, 50,
        "DUMMY",
        2,
        "blue",
        "vertical"
      ));
    }
  
    // Horizontal cars
    const horizontalCars = [];
    for (let i = 0; i < 4; i++) {
      horizontalCars.push(new Car(
        800 + i * 150,
        horizontalRoad.getLaneCenter(i % horizontalRoad.laneCount),
        30, 50,
        "DUMMY",
        2,
        "orange",
        "horizontal"
      ));
    }
  
    // Intersection lights
    const lights = [
      new TrafficLight(verticalRoad.getLaneCenter(1), 400, 3000, 3000, true),
      new TrafficLight(400, horizontalRoad.getLaneCenter(1), 3000, 3000, false)
    ];
  
    function animate() {
      map.height = 800;
  
      const allCars = [...verticalCars, ...horizontalCars];
      verticalCars.forEach(c => c.update(verticalRoad.borders, allCars, lights));
      horizontalCars.forEach(c => c.update(horizontalRoad.borders, allCars, lights));
      lights.forEach(light => light.update());
  
      ctx.clearRect(0, 0, map.width, map.height);
  
      verticalRoad.draw(ctx);
      horizontalRoad.draw(ctx);
  
      verticalCars.forEach(c => c.draw(ctx));
      horizontalCars.forEach(c => c.draw(ctx));
      lights.forEach(light => light.draw(ctx));
  
      requestAnimationFrame(animate);
    }
  
    animate();
  };
  