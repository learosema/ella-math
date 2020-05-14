import { Vec } from "./vector";
import { Mat } from "./matrix";

// https://www.khronos.org/opengl/wiki/GluLookAt_code
export function lookAt(eye: Vec, center: Vec, up: Vec): Mat {
  const forward = eye.sub(center).normalized;
  const side = forward.cross(up).normalized;
  const up2 = side.cross(forward);
  // prettier-ignore
  return new Mat([
     side.x,     side.y,     side.z,    0,
     up2.x,      up2.y,      up2.z,     0,
    -forward.x, -forward.y, -forward.z, 0,
        0,          0,          0,      1
  ]);
}
