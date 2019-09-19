export const Component = class {
	constructor(x, y, w, h) {
		this.parent = null;
		this.name = "Empty";
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.min_w = 0.0;
		this.min_h = 0.0;
		this.childs = [];
		this.dragFlag = false;
		this.clickFlag = false;
		this.dragStartCompX = 0.0;
		this.dragStartCompY = 0.0;
	}
	
	setup(){}
	update(){}
	update_sub(){
		w = max(min_w, w);
		h = max(min_h, h);
		for(int i = 0; i < childs.size(); i++){
			childs.get(i).update();
			childs.get(i).update_sub();
		}
	}
	draw(){};
	draw_sub(){
		for(int i = childs.size() - 1; i >= 0; i--){
			pushMatrix();
			translate(childs.get(i).x, childs.get(i).y);
			childs.get(i).draw();
			childs.get(i).draw_sub();
			popMatrix();
		}
	}
	add(Component child){
		childs.add(child);
		child.parent = this;
		child.setup();
		return child;
	}
	setMinSize(float tmp_min_w, float tmp_min_h){
		min_w = tmp_min_w;
		min_h = tmp_min_h;
	}
	mouseEvent(String type, float tmp_x, float tmp_y, float start_x, float start_y){
		if (mouseEventToChild(type, tmp_x, tmp_y, start_x, start_y)) return;
		switch(type){
			case "HIT":
				break;
			case "DOWN":
				dragStartCompX = x;
				dragStartCompY = y;
				break;
			case "UP":
				break;
			case "CLICK":
				break;
			case "MOVE":
				break;
			case "DRAG":
				x = dragStartCompX + tmp_x - start_x;
				y = dragStartCompY + tmp_y - start_y;
				break;
		}
	}
	mouseEventToChild(String type, float tmp_x, float tmp_y, float start_x, float start_y){
		if (type.equals("UP") && (dragFlag || clickFlag)){
			childs.get(0).mouseEvent(type, tmp_x - childs.get(0).x, tmp_y - childs.get(0).y, start_x - childs.get(0).x, start_y - childs.get(0).y);
			dragFlag = false;
			clickFlag = false;
		}
		if(dragFlag) {
			childs.get(0).mouseEvent(type, tmp_x - childs.get(0).x, tmp_y - childs.get(0).y, start_x - childs.get(0).x, start_y - childs.get(0).y);
			return true;
		}
		else{
			for(Component c : childs){
				if (c.checkHit(tmp_x, tmp_y)){
					switch(type){
						case "DOWN":
							activeChilds(c);
							c.mouseEvent(type, tmp_x - c.x, tmp_y - c.y, start_x - c.x, start_y - c.y);
							dragFlag = true;
							clickFlag = true;
							break;
						case "UP":
						case "DRAG":
							break;
						default:
							c.mouseEvent(type, tmp_x - c.x, tmp_y - c.y, start_x - c.x, start_y - c.y);
							break;
					}
					return true;
				}
			}
		}
		return false;
	}
	checkHit(float px, float py){
		if (
			x < px &&
			y < py &&
			px < x + w &&
			py < y + h
		) return true;
		for(Component c : childs){
			if(c.checkHit(px - x, py - y)) return true;
		}
		return false;
	}
	getHit(float px, float py){
		for(Component c : childs){
			if (c.checkHit(px, py)){
				return c.getHit(px - c.x, py - c.y);
			}
		}
		if (0.0f <= px && 0.0f <= py && px < w && py < h) return this;
		return null;
	}
	getRootComponent(){
		return (parent!=null)?parent.getRootComponent():this;
	}
	getGrobalPos(float px, float py){
		if(parent == null) return new PVector(x + px, y + py);
		else return parent.getGrobalPos(x + px, y + py);
	}
	activeChilds(Component c){
		int index = -1;
		for(int i = 0; i < childs.size(); i++){
			if(c == childs.get(i)) {
				index = i;
				break;
			}
		}
		if(index == -1) return;
		for(int i = 0; i < index; i++){
			swapChilds(index - i, index - i - 1);
		}
	}
	swapChilds(int index1, int index2){
		Component tmp = childs.get(index1);
		childs.set(index1, childs.get(index2));
		childs.set(index2, tmp);
	}
}