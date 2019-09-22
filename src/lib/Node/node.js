import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { Component } from "./Component/component.js";
import { RootComponent } from "./Component/root_component.js";
import { SwingComponent } from "./Component/swing_component.js";
import { DefaultComponent } from "./Component/default_component.js";
import { DraggableComponent } from "./Component/draggable_component.js";
import { Node, NodeParam } from "./Component/node_component.js";

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

		/*
		draggableComponent.add(new SwingComponent(30, 30, 140, 90));
		draggableComponent.childs[0].add(new SwingComponent(10, 10, 0, 0, 6));
		draggableComponent.childs[0].add(new SwingComponent(30, 30, 0, 0, 6));
		draggableComponent.childs[0].add(new SwingComponent(50, 50, 0, 0, 6));

		draggableComponent.add(new SwingComponent(200, 30, 140, 90));
		draggableComponent.childs[1].add(new SwingComponent(10, 10, 0, 0, 6));
		draggableComponent.childs[1].add(new SwingComponent(30, 30, 0, 0, 6));
		draggableComponent.childs[1].add(new SwingComponent(50, 50, 0, 0, 6));
		*/

		let node1 = draggableComponent.add(new Node("hoge", 30 + 170 * 0, 30));
		node1.inputs.add(new NodeParam("hoge"));
		node1.inputs.add(new NodeParam("hoge"));
		node1.inputs.add(new NodeParam("hoge"));
		node1.inputs.add(new NodeParam("hoge"));
		node1.outputs.add(new NodeParam("hoge"));
		node1.outputs.add(new NodeParam("hoge"));
		node1.outputs.add(new NodeParam("hoge"));

		let node2 = draggableComponent.add(new Node("hoge", 30 + 170 * 1, 30));
		node2.inputs.add(new NodeParam("hoge"));
		node2.outputs.add(new NodeParam("hoge"));
		node2.outputs.add(new NodeParam("hoge"));

		let node3 = draggableComponent.add(new Node("hoge", 30 + 170 * 2, 30));
		node3.inputs.add(new NodeParam("hoge"));
		node3.inputs.add(new NodeParam("hoge"));
		node3.outputs.add(new NodeParam("hoge"));
		node3.outputs.add(new NodeParam("hoge"));
		node3.outputs.add(new NodeParam("hoge"));

		let node4 = draggableComponent.add(new Node("hoge", 30 + 170 * 3, 30));
		node4.inputs.add(new NodeParam("hoge"));
		node4.outputs.add(new NodeParam("hoge"));
		node4.outputs.add(new NodeParam("hoge"));

		let node5 = draggableComponent.add(new Node("hoge", 30 + 170 * 4, 30));
		node5.inputs.add(new NodeParam("hoge"));
		node5.inputs.add(new NodeParam("hoge"));
		node5.inputs.add(new NodeParam("hoge"));
		node5.inputs.add(new NodeParam("hoge"));
		node5.inputs.add(new NodeParam("hoge"));
		node5.outputs.add(new NodeParam("hoge"));

		let node6 = draggableComponent.add(new Node("hoge", 30 + 170 * 5, 30));
		node6.inputs.add(new NodeParam("hoge"));

		let node7 = draggableComponent.add(new Node("hoge", 30 + 170 * 6, 30));
		node7.outputs.add(new NodeParam("hoge"));

		this.loop();
	}

	loop() {
		this.root.graphics.clear();

		this.root.graphics.stroke(1.0, 1.0, 1.0, 0.0);
		this.root.graphics.fill(1.0, 1.0, 1.0, 1.0);
		this.root.graphics.rect(0, 0, this.root.w, this.root.h);

		this.root.update();
		this.root.draw();

		setTimeout(this.loop.bind(this), 1000.0 / this.fps);
	}
};