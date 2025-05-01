class TrafficLight {
    constructor(x, y, greenDuration = 4000, redDuration = 4000) {
        this.x = x;
        this.y = y;
        this.greenDuration = greenDuration;
        this.redDuration = redDuration;
        this.isGreen = true;
        this.lastSwitchTime = Date.now();
    }

    update() {
        const now = Date.now();
        const elapsed = now - this.lastSwitchTime;

        if (this.isGreen && elapsed > this.greenDuration) {
            this.isGreen = false;
            this.lastSwitchTime = now;
        } else if (!this.isGreen && elapsed > this.redDuration) {
            this.isGreen = true;
            this.lastSwitchTime = now;
        }
    }

    draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = this.isGreen ? "green" : "red";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#000";
    ctx.fillText(this.isGreen ? "GO" : "STOP", this.x - 15, this.y - 15);
}

}
