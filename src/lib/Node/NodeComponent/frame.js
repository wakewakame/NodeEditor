import { Node, NodeParam } from "../Component/node_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const ValueNodeParam = class extends NodeParam {
	constructor(type, name) {
		super(type, name);
		this.x = 0.0;
		this.y = 0.0;
		this.z = 0.0;
		this.w = 0.0;
		this.mat = [];
		this.texture = null;
		this.shader = null;
	}
};

export const ShaderNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.shader = null;
		this.inputFrameNodeParam = null;
		this.outputFrameNodeParam = null;
	}
	setup(){
		super.setup();
		this.outputFrameNodeParam = this.outputs.add(new ValueNodeParam("shader", "output"));
		this.shader = this.graphics.createShader();
		this.shader.loadDefaultShader();
		this.outputFrameNodeParam.shader = this.shader;
	}
	deleted(){
		super.deleted();
		this.shader.delete();
	}
	loadShader(fragmentShader){
		let result = this.shader.loadShader(this.shader.default_shader.vertex, fragmentShader);
		if (result !== "") return result;
		for(let i of this.inputs.childs) this.inputs.remove(i);
		Object.keys(this.shader.uniforms_type).forEach((key) => {
			if (key === "matrix") return;
			let type = this.shader.uniforms_type[key];
			if (type === "sampler2D") {
				this.inputs.add(new ValueNodeParam("frame", key));
			}
			else {
				this.inputs.add(new ValueNodeParam(type, key));
			}
		});
		return "";
	}
	job(){
		super.job();
		for(let c of this.inputs.childs) {
			if(c.output === null) continue;
			switch(c.type){
				case "int":
				case "float":
					this.shader.set(
						c.name,
						c.output.x
					);
					break;
				case "ivec2":
				case "vec2":
					this.shader.set(
						c.name,
						c.output.x,
						c.output.y
					);
					break;
				case "ivec3":
				case "vec3":
					this.shader.set(
						c.name,
						c.output.x,
						c.output.y,
						c.output.z
					);
					break;
				case "ivec4":
				case "vec4":
					this.shader.set(
						c.name,
						c.output.x,
						c.output.y,
						c.output.z,
						c.output.w
					);
					break;
				case "mat2":
				case "mat3":
				case "mat4":
					this.shader.set(
						c.name,
						c.output.mat
					);
					break;
				case "frame":
					this.shader.set(
						c.name,
						c.output.texture
					);
					break;
			}
		}
	}
};

export const FrameNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.frameBuffer = null;
		this.inputShaderNodeParam = null;
		this.outputShaderNodeParam = null;
		this.previewShader = null;
	}
	setup(){
		super.setup();
		this.inputShaderNodeParam = this.inputs.add(new ValueNodeParam("shader", "input"));
		this.outputShaderNodeParam = this.outputs.add(new ValueNodeParam("frame", "output"));
		this.frameBuffer = this.graphics.createFrame(512, 512);
		this.outputShaderNodeParam.texture = this.frameBuffer.texture;
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
	deleted(){
		super.deleted();
		this.frameBuffer.delete();
		this.previewShader.delete();
	}
	job(){
		super.job();
		if (
			(this.inputs.childs.length !== 1) ||
			(!(this.inputs.childs[0] instanceof ValueNodeParam)) ||
			(this.inputs.childs[0].output === null)
		) return;
		let shader = this.inputs.childs[0].output.shader;
		this.frameBuffer.beginDraw();
		let tmp_current_shader = this.graphics.current_shader;
		this.graphics.shader(shader);
		this.graphics.rect(0, this.frameBuffer.height, this.frameBuffer.width, -this.frameBuffer.height);
		this.graphics.shader(tmp_current_shader);
		this.frameBuffer.endDraw();
	}
	update(){
		super.update();
		if (this.parent.childs[0] === this)	{
			this.reset();
			this.job();
		}
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
		this.outputShaderNodeParam = null;
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
		this.inputs.remove(this.inputShaderNodeParam);
		img.delete();
	}
};