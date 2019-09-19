import { Component } from "./component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const RootComponent = class extends {
	constructor(canvas) {
		super(new HydrangeaJS.Graphics(canvas), 0, 0, canvas.width, canvas.height);

		this.name = "Root";
		this.pmousePressed = false;
		this.dragStartMouseX = 0.0;
		this.dragStartMouseY = 0.0;
		this.original = new HydrangeaJS.GLMath.vec2(0.0, 0.0);
		this.mouse = new HydrangeaJS.GLMath.vec2(0.0, 0.0);
		this.pmouse = new HydrangeaJS.GLMath.vec2(0.0, 0.0);
		this.zoom = 1.0;
		this.wheel = 0.0;

		this.mouseX = 0.0;
		this.mouseY = 0.0;
		this.graphics.gapp.canvas.addEventListener("mousemove", (e) => {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		});

		this.setup();
	}
	update(){
		this.pmouse = this.mouse.copy();
		this.mouse.arr[0] = (this.mouseX - this.original.arr[0]) / this.zoom;
		this.mouse.arr[1] = (this.mouseY - this.original.arr[1]) / this.zoom;
		sendMouseEvent();
		super.update_sub();
	}
	draw(){
		pushMatrix();
		translate(original.arr[0], original.arr[1]);
		scale(zoom);
		draw_sub();
		popMatrix();
	};
	setZoom(float tmp_wheel){
		wheel -= tmp_wheel;
		float post_zoom = exp(wheel * 0.1f);
		original.arr[0] = mouseX + (original.arr[0] - mouseX) * (post_zoom / zoom);
		original.arr[1] = mouseY + (original.arr[1] - mouseY) * (post_zoom / zoom);
		zoom = post_zoom;
	}
	sendMouseEvent(){
		if ((!mousePressed) && dragFlag){
			childs.get(0).mouseEvent("UP", mouse.arr[0] - childs.get(0).x, mouse.arr[1] - childs.get(0).y, 0, 0);
			if(clickFlag) childs.get(0).mouseEvent("CLICK", mouse.arr[0] - childs.get(0).x, mouse.arr[1] - childs.get(0).y, 0, 0);
			dragFlag = false;
			clickFlag = false;
		}
		if(dragFlag){
			childs.get(0).mouseEvent("HIT", mouse.arr[0] - childs.get(0).x, mouse.arr[1] - childs.get(0).y, 0, 0);
			if(mouse.arr[0] != pmouse.arr[0] || mouse.arr[1] != pmouse.arr[1]){
				childs.get(0).mouseEvent("DRAG", mouse.arr[0] - childs.get(0).x, mouse.arr[1] - childs.get(0).y, dragStartMouseX - childs.get(0).x, dragStartMouseY - childs.get(0).y);
				clickFlag = false;
			}
		}
		else{
			for(Component c : childs){
				if (c.checkHit(mouse.arr[0], mouse.arr[1])){
					c.mouseEvent("HIT", mouse.arr[0] - c.x, mouse.arr[1] - c.y, 0, 0);
					if(mouse.arr[0] != pmouse.arr[0] || mouse.arr[1] != pmouse.arr[1]){
						c.mouseEvent("MOVE", mouse.arr[0] - c.x, mouse.arr[1] - c.y, 0, 0);
					}
					if(mousePressed && !pmousePressed){
						activeChilds(c);
						c.mouseEvent("DOWN", mouse.arr[0] - c.x, mouse.arr[1] - c.y, 0, 0);
						dragStartMouseX = mouse.arr[0]; dragStartMouseY = mouse.arr[1];
						dragFlag = true;
						clickFlag = true;
					}
					break;
				}
				c.update();
			}
		}
		pmousePressed = mousePressed;
	}
};