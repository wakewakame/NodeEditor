import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { Component } from "./Component/component.js";
import { RootComponent } from "./Component/root_component.js";
import { SwingComponent } from "./Component/swing_component.js";
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

		draggableComponent.add(new SwingComponent(30, 30, 140, 90));
		draggableComponent.childs[0].add(new SwingComponent(10, 10, 0, 0, 6));
		draggableComponent.childs[0].add(new SwingComponent(30, 30, 0, 0, 6));
		draggableComponent.childs[0].add(new SwingComponent(50, 50, 0, 0, 6));

		draggableComponent.add(new SwingComponent(200, 30, 140, 90));
		draggableComponent.childs[1].add(new SwingComponent(10, 10, 0, 0, 6));
		draggableComponent.childs[1].add(new SwingComponent(30, 30, 0, 0, 6));
		draggableComponent.childs[1].add(new SwingComponent(50, 50, 0, 0, 6));

		this.loop();
	}

	loop() {
		this.root.graphics.clear();

		this.root.graphics.fill(1.0, 1.0, 1.0, 1.0);
		this.root.graphics.rect(0, 0, this.root.w, this.root.h);

		this.root.update();
		this.root.draw();

		setTimeout(this.loop.bind(this), 1000.0 / this.fps);
	}
};