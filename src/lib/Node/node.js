import { HydrangeaJS } from "../HydrangeaJS/src/main.js";
import { RootComponent } from "./Component/root_component.js";
import { DraggableComponent } from "./Component/draggable_component.js";
import { FrameNode, TextureNode } from "./NodeComponent/frame.js";

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

		let node1 = draggableComponent.add(new TextureNode("hoge", "/examples/lena.png", 30 + 170 * 0, 30));
		let node2 = draggableComponent.add(new FrameNode  ("hoge", 30 + 170 * 1, 30));

		document.body.addEventListener('dragover', (e) => {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		}, false);
		document.body.addEventListener("drop", (e) => {
			e.stopPropagation();
			e.preventDefault();
			for(let file of e.dataTransfer.files) {
				let url = window.URL.createObjectURL(file);
				console.log(url);
				draggableComponent.add(new TextureNode("hoge", url, 30 + 170 * 0, 30));
			}
		}, false);

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