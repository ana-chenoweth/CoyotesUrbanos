const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

const lightCycle = 200;
let lightTimer = 0;

const lights = [
  { x: 370, y: 270, state: "green" },  // Intersection 1 (horizontal green)
  { x: 470, y: 270, state: "red" }     // Intersection 2 (vertical green)
];

const cars = [
  { x: 0, y: 285, dir: "right", speed: 2 },
  { x: -100, y: 285, dir: "right", speed: 2 },
  { x: 800, y: 315, dir: "left", speed: 2 },
  { x: 900, y: 315, dir: "left", speed: 2 },
  { x: 390, y: 0, dir: "down", speed: 2 },
  { x: 410, y: -100, dir: "down", speed: 2 }
];

function drawRoads() {
  ctx.fillStyle = "#555";
  // Horizontal roads
  ctx.fillRect(0, 280, 800, 20);
  ctx.fillRect(0, 320, 800, 20);
  // Vertical roads
  ctx.fillRect(380, 0, 20, 600);
  ctx.fillRect(420, 0, 20, 600);
}

function drawLights() {
  lights.forEach(light => {
    ctx.fillStyle = light.state;
    ctx.beginPath();
    ctx.arc(light.x, light.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawCars() {
  ctx.fillStyle = "blue";
  cars.forEach(car => {
    if (car.dir === "right" || car.dir === "left") {
      ctx.fillRect(car.x, car.y, 30, 15);
    } else {
      ctx.fillRect(car.x, car.y, 15, 30);
    }
  });
}

function checkCollision(car) {
  for (let otherCar of cars) {
    if (otherCar === car) continue;
    if (
      car.x < otherCar.x + 30 &&
      car.x + 30 > otherCar.x &&
      car.y < otherCar.y + 30 &&
      car.y + 30 > otherCar.y
    ) {
      return true;
    }
  }
  return false;
}

function handleTurns(car) {
  // Basic turning logic at intersections
  if (car.dir === "right" && car.x >= 370 && car.x < 380) {
    car.dir = "down";
    car.y = car.y + 15;
  } else if (car.dir === "left" && car.x <= 470 && car.x > 460) {
    car.dir = "up";
    car.y = car.y - 15;
  }
}

function getAIDecision() {
  // Placeholder for AI: random switching
  return Math.random() > 0.5 ? "green" : "red";
}

function updateLights() {
  lightTimer++;
  if (lightTimer >= lightCycle) {
    lights.forEach(light => {
      light.state = getAIDecision();
    });
    lightTimer = 0;
  }
}

function updateCars() {
  cars.forEach(car => {
    if (checkCollision(car)) return;

    handleTurns(car);

    if (car.dir === "right") {
      if (car.x + 30 < 370 || lights[0].state === "green") car.x += car.speed;
      if (car.x > 800) car.x = -40;
    } else if (car.dir === "left") {
      if (car.x > 470 || lights[1].state === "green") car.x -= car.speed;
      if (car.x < -40) car.x = 800;
    } else if (car.dir === "down") {
      if (car.y + 30 < 270 || lights[0].state === "red") car.y += car.speed;
      if (car.y > 600) car.y = -40;
    } else if (car.dir === "up") {
      if (car.y > 0 || lights[1].state === "green") car.y -= car.speed;
      if (car.y < -30) car.y = 600;
    }
  });
}

function update() {
  updateLights();
  updateCars();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoads();
  drawLights();
  drawCars();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
