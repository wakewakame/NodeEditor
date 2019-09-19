import { Graphics } from "./lib/graphics/graphics.js";
import { GLCore } from "./lib/gl_core/gl_core.js";
import { GLMath } from "./lib/utils/gl_math.js";

export const HydrangeaJS = {
	Graphics: Graphics,
	GLCore: GLCore,
	GLMath: GLMath,
};

window.HydrangeaJS = HydrangeaJS;
