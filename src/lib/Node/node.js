import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { Component } from "./Component/component.js";
import { RootComponent } from "./Component/root_component.js";
import { DefaultComponent } from "./Component/default_component.js";

export const Applet = class {
	constructor(canvas) {
		this.fps = 60.0;

        this.root = new RootComponent(canvas);

		this.loop();
	}

	loop() {
		this.root.graphics.clear();

		this.root.update();
        this.root.draw();

		setTimeout(this.loop.bind(this), 1000.0 / this.fps);
	}
};