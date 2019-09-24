import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { RootComponent } from "./Component/root_component.js";
import { DraggableComponent } from "./Component/draggable_component.js";
import { FrameNode } from "./NodeComponent/frame.js";

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

		let node1 = draggableComponent.add(new FrameNode("hoge", 30 + 170 * 0, 30));

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