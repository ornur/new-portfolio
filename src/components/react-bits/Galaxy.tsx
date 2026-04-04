"use client";

import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = /* glsl */ `
precision mediump float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform bool uIsMobile;

varying vec2 vUv;

#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
float tris(float x) { return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * fract(x) - 1.0)); }
float trisn(float x) { return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * fract(x) - 1.0))) - 1.0; }

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  
  // FIXED GLOW FOR MOBILE:
  // We boost the base glow radius if uIsMobile is true to compensate for DPR 1.0
  float baseGlow = uIsMobile ? (0.12 * uGlowIntensity) : (0.05 * uGlowIntensity);
  float m = baseGlow / d;
  
  if (!uIsMobile) {
      float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
      m += rays * flare * uGlowIntensity;
      vec2 rv = uv * MAT45;
      rays = smoothstep(0.0, 1.0, 1.0 - abs(rv.x * rv.y * 1000.0));
      m += rays * 0.3 * flare * uGlowIntensity;
  }
  
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      
      float glossLocal = tri(uStarSpeed / (3.0 * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      vec3 base = vec3(
          smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF,
          0.0,
          smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF
      );
      base.g = min(base.r, base.b) * seed;
      
      float hue = fract((atan(base.g - base.r, base.b - base.r) / 6.2831) + 0.5 + uHueShift / 360.0);
      float sat = length(base - dot(base, vec3(0.299, 0.587, 0.114))) * uSaturation;
      base = hsv2rgb(vec3(hue, sat, max(max(base.r, base.g), base.b)));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed * 0.1), tris(seed * 38.0 + uTime * uSpeed * 0.033)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);
      
      float twinkle = mix(1.0, trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0, uTwinkleIntensity);
      col += star * size * base * twinkle;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  
  // Interaction Logic - Only active if NOT mobile
  if (!uIsMobile) {
    if (uAutoCenterRepulsion > 0.0) {
      float centerDist = length(uv);
      uv += normalize(uv) * (uAutoCenterRepulsion / (centerDist + 0.1)) * 0.05;
    } else if (uMouseRepulsion) {
      vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
      float mouseDist = length(uv - mousePosUV);
      uv += normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1)) * 0.05 * uMouseActiveFactor;
    } else {
      uv += (uMouse - 0.5) * 0.1 * uMouseActiveFactor;
    }
  }

  float ang = uTime * uRotationSpeed;
  uv *= mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  uv *= mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x);

  vec3 col = vec3(0.0);
  float layers = uIsMobile ? 2.0 : 4.0; 
  for (float i = 0.0; i < 4.0; i += 1.0) {
    if (i >= layers) break;
    float depth = fract(i * 0.25 + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = clamp(smoothstep(0.0, 0.3, length(col)), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

interface GalaxyProps {
  autoCenterRepulsion?: number;
  density?: number;
  disableAnimation?: boolean;
  focal?: [number, number];
  glowIntensity?: number;
  hueShift?: number;
  mouseInteraction?: boolean;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  rotation?: [number, number];
  rotationSpeed?: number;
  saturation?: number;
  speed?: number;
  starSpeed?: number;
  transparent?: boolean;
  twinkleIntensity?: number;
}

export default function Galaxy({
  autoCenterRepulsion = 0,
  density = 1,
  disableAnimation = false,
  focal = [0.5, 0.5] as [number, number],
  glowIntensity = 0.3,
  hueShift = 140,
  mouseInteraction = true,
  mouseRepulsion = true,
  repulsionStrength = 2,
  rotation = [1.0, 0.0] as [number, number],
  rotationSpeed = 0.1,
  saturation = 0.0,
  speed = 1.0,
  starSpeed = 0.5,
  transparent = true,
  twinkleIntensity = 0.3,
  ...rest
}: GalaxyProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const dpr = isAndroid ? 1.0 : Math.min(1.5, window.devicePixelRatio || 1);

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: transparent, dpr });
    } catch {
      return;
    }

    const gl = renderer.gl;
    if (transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    const program = new Program(gl, {
      fragment: fragmentShader,
      uniforms: {
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uDensity: { value: density },
        uFocal: { value: new Float32Array(focal) },
        uGlowIntensity: { value: glowIntensity },
        uHueShift: { value: hueShift },
        uIsMobile: { value: isMobile },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseActiveFactor: { value: 0.0 },
        uMouseRepulsion: { value: mouseRepulsion },
        uRepulsionStrength: { value: repulsionStrength },
        uResolution: { value: new Color(0, 0, 0) },
        uRotation: { value: new Float32Array(rotation) },
        uRotationSpeed: { value: rotationSpeed },
        uSaturation: { value: saturation },
        uSpeed: { value: speed },
        uStarSpeed: { value: starSpeed },
        uTime: { value: 0 },
        uTransparent: { value: transparent },
        uTwinkleIntensity: { value: twinkleIntensity },
      },
      vertex: vertexShader,
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      );
    };

    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();

    let animateId: number;
    function update(t: number) {
      animateId = requestAnimationFrame(update);
      const time = t * 0.001;

      if (!disableAnimation) {
        program.uniforms.uTime.value = time;
        program.uniforms.uStarSpeed.value = (time * starSpeed) / 10.0;
      }

      // Interaction Logic - DISABLED FOR MOBILE
      if (!isMobile) {
        const lerp = 0.05;
        smoothMousePos.current.x +=
          (targetMousePos.current.x - smoothMousePos.current.x) * lerp;
        smoothMousePos.current.y +=
          (targetMousePos.current.y - smoothMousePos.current.y) * lerp;
        smoothMouseActive.current +=
          (targetMouseActive.current - smoothMouseActive.current) * lerp;

        program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
        program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
        program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;
      }

      renderer.render({ scene: mesh });
    }

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    // Only attach event listeners if NOT mobile
    const handlePointerMove = (e: PointerEvent) => {
      const rect = ctn.getBoundingClientRect();
      targetMousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
      targetMouseActive.current = 1.0;
    };

    if (!isMobile && mouseInteraction) {
      ctn.addEventListener("pointermove", handlePointerMove);
      ctn.addEventListener(
        "pointerleave",
        () => (targetMouseActive.current = 0.0),
      );
    }

    return () => {
      cancelAnimationFrame(animateId);
      ro.disconnect();
      ctn.removeEventListener("pointermove", handlePointerMove);
      if (gl.canvas.parentElement) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    focal,
    rotation,
    starSpeed,
    density,
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity,
    saturation,
    mouseRepulsion,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
  ]);

  return (
    <div
      className="relative h-full w-full bg-black overflow-hidden"
      ref={ctnDom}
      {...rest}
    />
  );
}
