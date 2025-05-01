class Car {
    constructor(x, y, width, height, type = "DUMMY", maxSpeed = 3, color = "black") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.type = type;
        this.color = color;
        this.useAI = type === "AI";

        this.controls = new Controls(type);
        this.sensor = this.useAI ? new Sensor(this) : null;
        this.brain = this.useAI ? new NeuralNetwork([this.sensor.rayCount, 6, 4]) : null;

        if (type === "DUMMY") {
            this.speed = 0; // Start from zero and accelerate manually
        }

        this.polygon = this.#createPolygon();

        console.log(`🔧 NEW car -> type: ${type}, x: ${x}, y: ${y}`);
    }

    update(roadBorders, traffic, trafficLights = []) {
        console.log(`🔁 Updating ${this.type} | damaged: ${this.damaged}`);
        if (!this.damaged) {
            this.#move();
            this.checkObstacles(trafficLights, traffic);
            this.polygon = this.#createPolygon();
            console.log(`🧪 Checking for collisions...`);
            this.damaged = this.#assessDamage(roadBorders, traffic);
            if (this.damaged) {
                console.log(`💥 ${this.type} collided with something!`);
            }
        }

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                (s) => (s === null ? 0 : 1 - s.offset)
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.useAI) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    checkObstacles(trafficLights, otherCars) {
        if (this.type === "KEYS") return;

        console.log(`🚦 ${this.type} checking obstacles`);
        let shouldStop = false;

        for (let light of trafficLights) {
            const sameLane = Math.abs(this.x - light.x) < this.width * 0.8;
            const distance = light.y - this.y;
            if (sameLane && distance > 0 && distance < 100) {
                if (!light.isGreen) {
                    console.log(`🛑 Stopped by red light at y=${light.y}, car y=${this.y}`);
                    this.speed = Math.max(this.speed - 0.1, 0);
                    shouldStop = true;
                    break;
                }
            }
        }

        for (let other of otherCars) {
            if (other === this) continue;
            const sameLane = Math.abs(this.x - other.x) < this.width * 0.8;
            const distance = other.y - this.y;
            if (sameLane && distance > 0 && distance < 60) {
                if (other.speed < this.speed) {
                    console.log(`🚗 Stopped by car ahead at y=${other.y}, my y=${this.y}`);
                    this.speed = Math.max(this.speed - 0.1, 0);
                }
                shouldStop = true;
                break;
            }
        }

        if (!shouldStop && this.type === "DUMMY") {
            console.log(`✅ Path clear, accelerating`);
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed * 0.6);
        }
    }

    #move() {
        console.log(`🦵 Moving ${this.type} | speed: ${this.speed.toFixed(2)} | y: ${this.y.toFixed(2)}`);

        if (this.type === "DUMMY") {
            this.x -= Math.sin(this.angle) * this.speed;
            this.y -= Math.cos(this.angle) * this.speed;
            console.log(`↕️ After move: y = ${this.y.toFixed(2)}`);
            return;
        }

        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        return points;
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let other of traffic) {
            if (other === this) continue; // ✅ skip self
            if (polysIntersect(this.polygon, other.polygon)) {
                return true;
            }
        }               
        return false;
    }

    draw(ctx, drawSensor = false) {
        console.log(`🎨 Drawing ${this.type} at y=${this.y.toFixed(2)}`);

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }

        ctx.fillStyle = this.damaged ? "gray" : this.color;
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
    }
}
