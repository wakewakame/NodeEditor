import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { Component } from "./Component/component.js";
import { RootComponent } from "./Component/root_component.js";
import { DefaultComponent } from "./Component/default_component.js";

export const Applet = class {
	constructor(canvas) {
		this.fps = 60.0;
		this.mouse = {x: 0, y: 0};
		this.graphics = new HydrangeaJS.Graphics(canvas);
		window.addEventListener("resize", (event) => {
			this.graphics.resize(window.innerWidth, window.innerHeight);
		});
		this.graphics.resize(window.innerWidth, window.innerHeight);
		this.graphics.gapp.canvas.addEventListener("mousemove", (e) => {
			this.mouse = {x: e.clientX, y: e.clientY};
		});

		this.loop();
	}

	loop() {
		this.graphics.clear();

		this.graphics.fill(1.0, 0.0, 0.0);
		this.graphics.stroke(0.0, 0.0, 1.0);
		this.graphics.gshape.beginWeightShape(10.0);
		this.graphics.gshape.color(1, 0, 0); this.graphics.gshape.vertex(100, 100, 0, 1, 0);
		this.graphics.gshape.color(1, 0, 0); this.graphics.gshape.vertex(500, 500, 0, 1, 0);
		this.graphics.gshape.color(1, 0, 0); this.graphics.gshape.vertex(100, 500, 0, 1, 0);
		this.graphics.gshape.color(1, 0, 0); this.graphics.gshape.vertex(this.mouse.x, this.mouse.y, 0, 0, 1);
		this.graphics.gshape.endWeightShape();
		this.graphics.shape(this.graphics.gshape);
		this.graphics.strokeWeight(10);
		this.graphics.bezier(100, 100, 500, 500, 100, 500, this.mouse.x, this.mouse.y);
		this.graphics.render();

		setTimeout(this.loop.bind(this), 1000.0 / this.fps);
	}
};