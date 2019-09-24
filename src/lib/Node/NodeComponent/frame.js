import { Node, NodeParam } from "../Component/node_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const ShaderNodeParam = class extends NodeParam {

};

export const ShaderNode = class extends Node {

};

export const FrameNodeParam = class extends NodeParam {
	constructor(name) {
		super(name);
	}
	setup(){
		super.setup();
	}
	deleted(){
		super.deleted();
	}
	canOutput(p){
		return true;
	}
	job() {}
	reset() {}
	update() {
		super.update();
	}
	draw() {
		super.draw();
	}
};

export const FrameNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.frameBuffer = null;
		this.inputFrameNodeParam = null;
		this.outputFrameNodeParam = null;
		this.previewShader = null;
	}
	setup(){
		super.setup();
		this.inputFrameNodeParam = this.inputs.add(new FrameNodeParam("input"));
		this.outputFrameNodeParam = this.outputs.add(new FrameNodeParam("output"));
		this.frameBuffer = new HydrangeaJS.GLCore.Frame(this.graphics.gapp, 1, 1);
		this.previewShader = this.graphics.createShader();
		this.previewShader.loadShader(this.previewShader.default_shader.vertex, `
			precision highp float;
			uniform sampler2D texture;
			uniform vec2 textureArea;
			varying vec2 vUv;
			varying vec4 vColor;

			void main(void){
				gl_FragColor = texture2D(texture, vUv * textureArea);
			}
		`);
	}
	job(){
		super.job();
	}
	reset(){
		super.reset();
	}
	update(){
		super.update();
	}
	draw(){
		super.draw();
		let tmp_current_shader = this.graphics.current_shader;
		this.graphics.shader(this.previewShader);
		this.previewShader.set("texture", this.frameBuffer.texture);
		this.previewShader.set(
			"textureArea",
			this.frameBuffer.texture.width  / this.frameBuffer.texture.pow2_width,
			this.frameBuffer.texture.height / this.frameBuffer.texture.pow2_height
		);
		this.graphics.shape(this.inner_shape);
		this.graphics.shader(tmp_current_shader);
	}
};

export const TextureNode = class extends FrameNode {
	constructor(name, img_url, x, y) {
		super(name, x, y);
		this.img_url = img_url;
		this.frameBuffer = null;
		this.outputFrameNodeParam = null;
		this.previewShader = null;
	}
	setup(){
		super.setup();
		let img = this.graphics.createTexture(0, 0);
		img.loadImg(this.img_url, () => {
			this.frameBuffer.resize(img.width, img.height);
			this.frameBuffer.beginDraw();
			this.graphics.image(img, 0, img.height, img.width, 0.0 - img.height);
			this.frameBuffer.endDraw();
			this.resizeBox.target.y = this.w * img.height / img.width;
		});
		this.inputs.remove(this.inputFrameNodeParam);
	}
	job(){
		super.job();
	}
	reset(){
		super.reset();
	}
	update(){
		super.update();
	}
	draw(){
		super.draw();
	}
};