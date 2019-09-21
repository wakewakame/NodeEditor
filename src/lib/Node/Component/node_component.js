import { Component } from "./component.js";
import { SwingComponent } from "./swing_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const NodeParam = class extends Component {
	constructor(name) {
		super(0.0, 0.0, 0.0, 0.0);
		this.name = name;

		this.node = null;
		this.output = null;
		this.vector = null;
		this.isInput = false;
		this.size = 0.0;
	}
	canOutput(p){
		return true;
	}
	job() {}
	reset() {}
	update() {
		if (this.output !== null) {
			this.vector = this.output.getGrobalPos(0.0, 0.0);
			this.vector.sub(this.getGrobalPos(0.0, 0.0));
			this.vector.add(new HydrangeaJS.GLMath.vec2(
				this.output.isInput ? 0.0 : this.output.size,
				this.output.size / 2.0
			));
		}
	}
	draw() {
		this.graphics.strokeWeight(3.5);
		this.graphics.stroke(0.3, 0.3, 0.3, 1.0);
		this.graphics.fill(1.0, 1.0, 1.0, 1.0);
		this.graphics.ellipse(this.size / 2.0, this.size / 2.0, this.size, this.size);
		this.graphics.strokeWeight(2.0);
		this.graphics.stroke(30.0 / 255.0, 30.0 / 255.0, 30.0 / 255.0, 255.0 / 255.0);
		if(this.vector !== null) {
			if(this.isInput) this.bezier(0.0, this.size / 2.0, this.vector.arr[0], this.vector.arr[1], 0.5);
			else this.bezier(this.vector.arr[0], this.vector.arr[1], this.size, this.size / 2.0, 0.5);
		}
	}
	bezier(x1, y1, x2, y2, p) {
		let div = 32;
		p *= Math.abs(x2 - x1);
		this.graphics.strokeWeight(3.5);
		this.graphics.stroke(0.3, 0.3, 0.3, 1.0);
		for (let i = 0; i < div; i++) {
			let f1 = i / div;
			let f2 = f1 + (1.0 / div);
			this.graphics.line(
				Math.pow(1.0 - f1, 3.0) * x1 + 3.0 * Math.pow(1.0 - f1, 2.0) * Math.pow(f1, 1.0) * (x1 - p) + 3.0 * Math.pow(1.0 - f1, 1.0) * Math.pow(f1, 2.0) * (x2 + p) + Math.pow(f1, 3.0) * x2,
				Math.pow(1.0 - f1, 3.0) * y1 + 3.0 * Math.pow(1.0 - f1, 2.0) * Math.pow(f1, 1.0) * y1 + 3.0 * Math.pow(1.0 - f1, 1.0) * Math.pow(f1, 2.0) * y2 + Math.pow(f1, 3.0) * y2,
				Math.pow(1.0 - f2, 3.0) * x1 + 3.0 * Math.pow(1.0 - f2, 2.0) * Math.pow(f2, 1.0) * (x1 - p) + 3.0 * Math.pow(1.0 - f2, 1.0) * Math.pow(f2, 2.0) * (x2 + p) + Math.pow(f2, 3.0) * x2,
				Math.pow(1.0 - f2, 3.0) * y1 + 3.0 * Math.pow(1.0 - f2, 2.0) * Math.pow(f2, 1.0) * y1 + 3.0 * Math.pow(1.0 - f2, 1.0) * Math.pow(f2, 2.0) * y2 + Math.pow(f2, 3.0) * y2
			);
		}
	}
	mouseEvent(type, x, y, start_x, start_y) {
		if (this.isInput) {
			if (type === "UP" && this.output === null) this.vector = null;
			if (type === "DRAG") {
				this.vector = new HydrangeaJS.GLMath.vec2(x, y);
				let grobalMouse = this.getGrobalPos(this.vector.arr[0], this.vector.arr[1]);
				let hit = this.getRootComponent().getHit(grobalMouse.arr[0], grobalMouse.arr[1]);
				this.output = null;
				if(hit instanceof NodeParam) { this.output = hit; } else { return };
				if((this.output === this) || (this.output.isInput)){
					this.output = null;
					return;
				}
				this.output = this.canOutput(this.output) ? this.output : null;
			}
		}
		else {
			if (type === "UP"){
				this.vector = null;
				if (this.output !== null){
					this.output.output = this;
					this.output = null;
				}
			}
			if (type === "DRAG") {
				this.vector = new HydrangeaJS.GLMath.vec2(x, y);
				let grobalMouse = this.getGrobalPos(this.vector.arr[0], this.vector.arr[1]);
				let hit = this.getRootComponent().getHit(grobalMouse.arr[0], grobalMouse.arr[1]);
				this.output = null;
				if(hit instanceof NodeParam) { this.output = hit; } else { return };
				if((this.output === this) || (!this.output.isInput)){
					this.output = null;
					return;
				}
				this.output = this.output.canOutput(this) ? this.output : null;
			}
		}
	}
};

export const NodeParams = class extends Component {
	constructor(x, y, size, gap, input, node) {
		super(x, y, size, gap);

		this.size = size;
		this.gap = gap;
		this.isInput = input;
		this.node = node;

		this.name = this.isInput ? "Input" : "Output";
	}
	add(child){
		if(!(child instanceof NodeParam)) return null;
		child.x = 0;
		child.y = this.h;
		child.size = this.size;
		child.w = child.h = this.size;
		child.isInput = this.isInput;
		child.node = this.node;
		this.h += this.size + this.gap;
		return super.add(child);
	}
	checkHit(px, py){
		for(let c of this.childs){
			if(c.checkHit(px - this.x, py - this.y)) return true;
		}
		return false;
	}
};

export const Node = class extends SwingComponent {
	constructor(name, x, y) {
		super(x, y, 140.0, 0.0);
		name = name;

		this.paramSize = 20.0;
		this.paramGap = 12.0;
		this.finishJob = false;
	}
	setup(){
		super.setup();
		this.inputs = new NodeParams(0.0 - this.paramSize / 2.0, 0, this.paramSize, this.paramGap, true, this);
		this.outputs = new NodeParams(this.w - this.paramSize / 2.0, 0, this.paramSize, this.paramGap, false, this);
		this.add(this.inputs); this.add(this.outputs);
	}
	job(){
		this.finishJob = true;
		for(let c of this.inputs.childs){
			let p = c.output;
			if(p === null) continue;
			let n = p.node;
			if(n === null) continue;
			if(!n.finishJob) n.job();
			c.job();
		}
	}
	reset(){
		this.finishJob = false;
		for(let c of this.inputs.childs){
			let p = c.output;
			if(p === null) continue;
			let n = p.node;
			if(n === null) continue;
			if(n.finishJob) n.reset();
			c.reset();
		}
	}
	update(){
		this.min_w = this.inputs.w + this.outputs.w;
		this.min_h = Math.max(this.inputs.h, this.outputs.h);
		super.update();
	}
	draw(){
		this.inputs.x = 0.0 - this.paramSize / 2.0; this.inputs.y = 0.0;
		this.outputs.x = this.w - this.paramSize / 2.0; this.outputs.y = 0.0;
		super.draw();
	}
};
