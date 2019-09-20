import { Component } from "./component.js";

const ResizeBox = class extends Component {
	constructor(){
		super(0.0, 0.0, 0.0, 0.0);
		this.name = "ResizeBox";
	}
	setup(){
		this.w = this.h = 20.0;
		this.x = this.parent.w - this.w;
		this.y = this.parent.h - this.h;
	}
	update(){
		this.x = Math.max(0.0, this.x);
		this.y = Math.max(0.0, this.y);
		this.x = Math.max(this.parent.min_w - this.w, this.x);
		this.y = Math.max(this.parent.min_h, this.y);
		this.parent.w = this.x + this.w;
		this.parent.h = this.y + this.h;
	}
	draw(){
		this.graphics.fill(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0);
		this.graphics.strokeWeight(2.0);
		this.graphics.stroke(30.0 / 255.0, 30.0 / 255.0, 30.0 / 255.0, 255.0 / 255.0);
		this.graphics.line(this.w, 0.0, 0.0, this.h);
	}
	checkHit(px, py){
		return super.checkHit(px, py) && (py - this.y > this.w - (px - this.x));
	}
	mouseEvent(type, x, y, start_x, start_y){
		if (this.mouseEventToChild(type, x, y, start_x, start_y)) return;
		switch(type) {
		case "HIT":
			break;
		case "DOWN":
			this.dragStartCompX = this.x;
			this.dragStartCompY = this.y;
			break;
		case "UP":
			
			break;
		case "CLICK":
			break;
		case "MOVE":
			break;
		case "DRAG":
			this.x = this.dragStartCompX + x - start_x;
			this.y = this.dragStartCompY + y - start_y;
			break;
		}
	}
};

export const DefaultComponent = class extends Component {
	constructor(x, y, w, h){
		super(x, y, w, h);
		this.name = "Empty Node";
	}
	setup(){
		this.add(new ResizeBox());
	}
	update(){
		/*
		if(this.parent != null){
			this.x = Math.max(0.0, this.x);
			this.y = Math.max(0.0, this.y);
			this.x = Math.min(this.x, this.parent.w - this.w);
			this.y = Math.min(this.y, this.parent.h - this.h);
		}
		*/
	}
	draw(){
		this.graphics.strokeWeight(2.0);
		this.graphics.stroke(30.0 / 255.0, 30.0 / 255.0, 30.0 / 255.0, 255.0 / 255.0);
		this.graphics.fill(220.0 / 255.0, 220.0 / 255.0, 220.0 / 255.0, 178.0 / 255.0);
		this.graphics.rect(0.0, 0.0, this.w, this.h, 4.0);
		this.graphics.fill(30.0 / 255.0, 30.0 / 255.0, 30.0 / 255.0, 255.0 / 255.0);
	}
};