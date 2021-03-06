import { Component } from "./component.js";
import { SwingComponent } from "./swing_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const NodeParam = class extends Component {
	constructor(type, name) {
		super(0.0, 0.0, 0.0, 0.0);
		this.type = type;
		this.name = name;

		this.node = null;
		this.output = null;
		this.vector = null;
		this.isInput = false;
		this.size = 0.0;
		this.hit = 0.0;

		this.inner_shape = null;
		this.outer_shape = null;
		this.arrow_shape = null;
	}
	setup(){
		this.update_shape();
	}
	deleted(){
		if (this.inner_shape !== null) this.inner_shape.delete();
		if (this.outer_shape !== null) this.outer_shape.delete();
		if (this.arrow_shape !== null) this.arrow_shape.delete();
	}
	update_shape(){
		this.inner_shape = new HydrangeaJS.GLCore.Shape(this.graphics.gapp);
		this.outer_shape = new HydrangeaJS.GLCore.Shape(this.graphics.gapp);
		this.arrow_shape = new HydrangeaJS.GLCore.Shape(this.graphics.gapp);
		const weight = 6.0;
		const div = 32;
		this.inner_shape.beginShape(this.inner_shape.gl.TRIANGLE_FAN);
		this.inner_shape.color(1.0, 1.0, 1.0, 1.0);
		for(let i = 0; i < div; i++) this.inner_shape.vertex(
			0.5 * this.size + 0.5 * (this.size - weight + this.hit * 0.5 * this.size) * Math.cos(2.0 * Math.PI * i / div),
			0.5 * this.size + 0.5 * (this.size - weight + this.hit * 0.5 * this.size) * Math.sin(2.0 * Math.PI * i / div),
			0.0
		);
		this.inner_shape.endShape();
		this.outer_shape.beginShape(this.outer_shape.gl.TRIANGLE_FAN);
		this.outer_shape.color(0.3, 0.3, 0.3, 1.0);
		for(let i = 0; i < div; i++) this.outer_shape.vertex(
			0.5 * this.size + 0.5 * (this.size + weight + this.hit * 0.5 * this.size) * Math.cos(2.0 * Math.PI * i / div),
			0.5 * this.size + 0.5 * (this.size + weight + this.hit * 0.5 * this.size) * Math.sin(2.0 * Math.PI * i / div),
			0.0
		);
		this.outer_shape.endShape();
		this.arrow_shape.beginShape(this.outer_shape.gl.TRIANGLE_FAN);
		this.arrow_shape.color(0.3, 0.3, 0.3, 1.0);
		this.arrow_shape.vertex(-20.0, 10.0, 0.0);
		this.arrow_shape.vertex(0.0, 0.0, 0.0);
		this.arrow_shape.vertex(-20.0, -10.0, 0.0);
		this.arrow_shape.endShape();

	}
	canOutput(p){
		return p.type === this.type;
	}
	job() {}
	reset() {}
	update() {
		if (this.output !== null) {
			if (this.output.graphics === null) {
				this.output = null;
				this.vector = null;
			}
			else {
				this.vector = this.output.getGrobalPos(0.0, 0.0);
				this.vector.sub(this.getGrobalPos(0.0, 0.0));
				this.vector.add(new HydrangeaJS.GLMath.vec2(
					this.output.isInput ? 0.0 : this.output.size,
					this.output.size / 2.0
				));
			}
		}
		if (this.hit != 0.0) {
			this.hit = Math.max(0.0, this.hit - 0.25);
			this.update_shape();
		}
	}
	draw() {
		this.graphics.shape(this.outer_shape);
		this.graphics.shape(this.inner_shape);
		this.graphics.strokeWeight(3.5);
		this.graphics.stroke(0.3, 0.3, 0.3, 1.0);
		if(this.vector !== null) {
			if(this.isInput) this.bezier(0.0, this.size / 2.0, this.vector.arr[0], this.vector.arr[1]);
			else this.bezier(this.vector.arr[0], this.vector.arr[1], this.size, this.size / 2.0);
		}
	}
	bezier(x1, y1, x2, y2) {
		this.graphics.bezier(
			x1 - 20.0, y1,
			x1 - 20.0 - 100.0, y1,
			x2 + 100.0, y2,
			x2, y2,
			16
		);
		this.graphics.pushMatrix();
		this.graphics.translate(x1, y1);
		this.graphics.shape(this.arrow_shape);
		this.graphics.popMatrix();
	}
	mouseEvent(type, x, y, start_x, start_y) {
		if (type === "HIT") { this.hit = Math.min(1.0, this.hit + 0.5); this.update_shape(); }
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
		this.name = name;

		this.paramSize = 20.0;
		this.paramGap = 10.0;
		this.finishJob = false;

		this.inputs = null;
		this.outputs = null;
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
			if(p === null || p.graphics === null) continue;
			let n = p.node;
			if(n === null || n.graphics === null) continue;
			if(!n.finishJob) n.job();
			c.job();
		}
	}
	reset(){
		this.finishJob = false;
		for(let c of this.inputs.childs){
			let p = c.output;
			if(p === null || p.graphics === null) continue;
			let n = p.node;
			if(n === null || n.graphics === null) continue;
			if(n.finishJob) n.reset();
			c.reset();
		}
	}
	update(){
		this.min_w = this.inputs.w + this.outputs.w;
		this.min_h = Math.max(this.inputs.h, this.outputs.h) + 0.5 * this.paramSize;
		super.update();
	}
	draw(){
		this.inputs.x = 0.0 - 0.5 * this.paramSize; this.inputs.y = 0.5 * (this.h - this.inputs.h);
		this.outputs.x = this.w - 0.5 * this.paramSize; this.outputs.y = 0.5 * (this.h - this.outputs.h);
		super.draw();
	}
};