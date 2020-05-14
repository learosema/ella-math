import { Vec } from './ella';

export type Axes = 'xy' | 'xz' | 'yz';

/** @class Geometry */
export class Geometry {
  constructor(
    public vertices: Vec[],
    public faces: number[][],
    public normals: Vec[],
    public texCoords: Vec[]
  ) {}

  /**
   * converts to triangle array
   */
  toTriangles() {
    // TODO: check if correct, I'm super tired
    const { faces, vertices } = this;
    return faces
      .map((f) => {
        if (f.length === 3) {
          return f.map((vertexIndex) => vertices[vertexIndex]);
        }
        if (f.length === 4) {
          const q = f.map((vertexIndex) => vertices[vertexIndex]);
          return [q[0], q[1], q[3], q[3], q[1], q[2]];
        }
      })
      .flat()
      .map((v) => v.toArray())
      .flat();
  }

  /**
   * create rectangle geometry
   * @param a length of side A
   * @param b length of side B
   * @param axes
   */
  static rect(sizeA: number, sizeB: number, axes: Axes = 'xy') {
    const a = sizeA * 0.5;
    const b = sizeB * 0.5;
    switch (axes) {
      case 'xy':
        return [-a, -b, 0, a, -b, 0, -a, b, 0, -a, b, 0, a, -b, 0, a, b, 0];
      case 'xz':
        return [-a, 0, -b, a, 0, -b, -a, 0, b, -a, 0, b, a, 0, -b, a, 0, b];
      case 'yz':
        return [0, -a, -b, 0, a, -b, 0, -a, b, 0, -a, b, 0, a, -b, 0, a, b];
    }
  }

  static tri(a: Vec, b: Vec, c: Vec) {
    return [a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z];
  }

  static quad(a: Vec, b: Vec, c: Vec, d: Vec) {
    // a----b
    // |    |
    // d----c
    //
    return [...Geometry.tri(a, b, d), ...Geometry.tri(d, b, c)];
  }

  /**
   * Create square geometry (2 triangles) *
   * @name square
   * @param size
   */
  static square(size: number = 1, axes: Axes = 'xy') {
    return Geometry.rect(size, size, axes);
  }

  /**
   * Create a box geometry with the sizes a * b * c,
   * centered at (0, 0, 0), 2 triangles per side.
   *
   * @name box
   * @param {number} sizeA
   * @param {number} sizeB
   * @param {number} sizeC
   */
  static box(sizeA = 1.0, sizeB = 1.0, sizeC = 1.0) {
    const a = sizeA * 0.5;
    const b = sizeB * 0.5;
    const c = sizeC * 0.5;
    const vertices = [
      [-a, -b, -c],
      [a, -b, -c],
      [-a, b, -c],
      [a, b, -c],
      [-a, -b, c],
      [a, -b, c],
      [-a, b, c],
      [a, b, c],
    ];
    //     0______1
    //   4/|____5/|
    //   |2|____|_|3
    //   |/ ____|/
    //  6       7

    const faces: number[][] = [
      // back
      [0, 1, 2],
      [2, 1, 3],
      // front
      [5, 4, 7],
      [7, 4, 6],
      // left
      [4, 0, 6],
      [6, 0, 2],
      // right
      [7, 5, 1],
      [1, 7, 3],
      // top
      [1, 0, 5],
      [5, 0, 4],
      // bottom
      [2, 3, 6],
      [6, 3, 7],
    ];
    const result = faces
      .flat()
      .map((vertexIndex: number) => vertices[vertexIndex])
      .flat();
    return result;
  }

  /**
   * create a cube
   * @param size
   */
  static cube(size = 1.0) {
    return Geometry.box(size, size, size);
  }

  /**
   * create 2D grid geometry
   * @param deltaX distance between x coordinates
   * @param deltaY distance between y coordinates
   * @param xMin minimum x coordinate
   * @param yMin minimum y coordinate
   * @param xMax maximum x coordinate
   * @param yMax maximum y coordinate
   * @returns an array of 2D coordinates [x0, y0, x1, y1, ...] for use with GL_TRIANGLES
   */
  static grid(
    deltaX = 0.1,
    deltaY = 0.1,
    xMin = -1,
    yMin = -1,
    xMax = 1,
    yMax = 1
  ) {
    const dimX = Math.round((xMax - xMin) / deltaX);
    const dimY = Math.round((yMax - yMin) / deltaY);
    /* More modelling in ASCII art :)

    x--x--x
    | /| /|
    |/ |/ |
    x--x--x
    | /| /|
    |/ |/ |
    x--x--x

    */

    const squares = Array(dimX * dimY)
      .fill(0)
      .map((_, idx) => {
        const col = idx % dimX;
        const row = (idx / dimX) | 0;
        const x0 = xMin + deltaX * col;
        const y0 = yMin + deltaY * row;
        const x1 = x0 + deltaX;
        const y1 = y0 + deltaY;
        // return two triangles per square
        return [x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1];
      });
    return squares.flat();
  }

  /**
   * Create sphere geometry
   * @param r radius
   * @param sides number of sides (around the sphere)
   * @param segments number of segments (from top to bottom)
   * @see adapted from https://vorg.github.io/pex/docs/pex-gen/Sphere.html
   */
  static sphere(r = 0.5, sides = 36, segments = 18) {
    const vertices = [];
    const texCoords = [];
    const normals = [];
    const faces = [];

    const dphi = 360 / sides;
    const dtheta = 180 / segments;

    const evalPos = (theta: number, phi: number) => {
      const deg = Math.PI / 180.0;
      var pos = new Vec(
        r * Math.sin(theta * deg) * Math.sin(phi * deg),
        r * Math.cos(theta * deg),
        r * Math.sin(theta * deg) * Math.cos(phi * deg)
      );
      return pos;
    };

    for (let segment = 0; segment <= segments; segment++) {
      const theta = segment * dtheta;
      for (let side = 0; side <= sides; side++) {
        const phi = side * dphi;
        const pos = evalPos(theta, phi);
        const normal = pos.clone().normalized;
        const texCoord = new Vec(phi / 360.0, theta / 180.0);

        vertices.push(pos);
        normals.push(normal);
        texCoords.push(texCoord);

        if (segment === segments) continue;
        if (side === sides) continue;

        if (segment == 0) {
          // first segment uses triangles
          faces.push([
            segment * (sides + 1) + side,
            (segment + 1) * (sides + 1) + side,
            (segment + 1) * (sides + 1) + side + 1,
          ]);
        } else if (segment == segments - 1) {
          // last segment also uses triangles
          faces.push([
            segment * (sides + 1) + side,
            (segment + 1) * (sides + 1) + side + 1,
            segment * (sides + 1) + side + 1,
          ]);
        } else {
          // A --- B
          // D --- C
          faces.push([
            segment * (sides + 1) + side,
            (segment + 1) * (sides + 1) + side,
            (segment + 1) * (sides + 1) + side + 1,
            segment * (sides + 1) + side + 1,
          ]);
        }
      }
    }
    return new Geometry(vertices, faces, normals, texCoords);
  }
}
