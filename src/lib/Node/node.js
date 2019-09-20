import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { Component } from "./Component/component.js";
import { RootComponent } from "./Component/root_component.js";
import { DefaultComponent } from "./Component/default_component.js";
import { DraggableComponent } from "./Component/draggable_component.js";

export const Applet = class {
	constructor(canvas) {
		this.fps = 60.0;

		this.root = new RootComponent(canvas);
		window.addEventListener("resize", (e) => {
			this.root.graphics.resize(window.innerWidth, window.innerHeight);
		});
		this.root.graphics.resize(window.innerWidth, window.innerHeight);

		const draggableComponent = new DraggableComponent();
		this.root.add(draggableComponent);

		draggableComponent.add(new DefaultComponent(10, 10, 400, 400));
		draggableComponent.childs[0].add(new DefaultComponent(10, 10, 100, 100));
		draggableComponent.childs[0].add(new DefaultComponent(30, 30, 100, 100));
		draggableComponent.childs[0].add(new DefaultComponent(50, 50, 100, 100));

		this.loop();
	}

	loop() {
		this.root.graphics.clear();

		this.root.graphics.fill(1, 0, 0, 1);
		this.root.graphics.rect(-10, -10, 1000, 1000);

		this.root.update();
		this.root.draw();

		setTimeout(this.loop.bind(this), 1000.0 / this.fps);
	}
};