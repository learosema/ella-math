import { Vec } from './vector';

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
    const { faces, vertices } = this;
    return faces
      .map((face) => {
        if (face.length === 3) {
          return face.map((vertexIndex) => vertices[vertexIndex]);
        }
        if (face.length === 4) {
          const q = face.map((vertexIndex) => vertices[vertexIndex]);
          return [q[0], q[1], q[3], q[3], q[1], q[2]];
        }
        throw Error('not supported');
      })
      .flat()
      .map((v) => v.toArray())
      .flat();
  }

  /**
   * Calculate the surface normal of a triangle
   * @param p1 3d vector of point 1
   * @param p2 3d vector of point 2
   * @param p3 3d vector of point 3
   */
  static calculateSurfaceNormal(p1: Vec, p2: Vec, p3: Vec): Vec {
    const u = p2.sub(p1);
    const v = p3.sub(p1);
    return new Vec(
      u.x * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x
    );
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
    ].map((v) => new Vec(...v));
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
    const normals = faces.map((f) =>
      Geometry.calculateSurfaceNormal(
        vertices[f[0]],
        vertices[f[1]],
        vertices[f[2]]
      )
    );
    return new Geometry(vertices, faces, normals, []);
  }

  /**
   * create a cube
   * @param size
   */
  static cube(size = 1.0) {
    return Geometry.box(size, size, size);
  }

  /**
   * create a plane grid mesh
   * @param x x-coord of the top left corner
   * @param y y-coord of the top left corner
   * @param width width of the plane
   * @param height height of the plane
   * @param rows number of rows
   * @param cols number of columns
   */
  static grid(
    x: number,
    y: number,
    width: number,
    height: number,
    rows: number,
    cols: number
  ): Geometry {
    const deltaX = width / cols;
    const deltaY = height / rows;
    const vertices: Vec[] = Array((cols + 1) * (rows + 1))
      .fill(0)
      .map((_, i) => {
        const ix = i % cols;
        const iy = (i / cols) | 0;
        return new Vec(x + ix * deltaX, y + iy * deltaY, 0);
      });
    const faces: number[][] = Array(rows * cols)
      .fill(0)
      .map((_, i) => {
        const ix = i % cols;
        const iy = (i / cols) | 0;
        const idx = iy * rows + ix;
        return [
          [idx, idx + 1, idx + rows],
          [idx + 1, idx + rows + 1, idx + rows],
        ];
      })
      .flat(1);
    const normals = faces.map((f) =>
      Geometry.calculateSurfaceNormal(
        vertices[f[0]],
        vertices[f[1]],
        vertices[f[2]]
      )
    );
    return new Geometry(vertices, faces, normals, []);
  }

  /**
   * Create sphere geometry
   * @param r radius
   * @param sides number of sides (around the sphere)
   * @param segments number of segments (from top to bottom)
   * @see adapted from https://vorg.github.io/pex/docs/pex-gen/Sphere.html
   */
  static sphere(r = 0.5, sides = 36, segments = 18) {
    const vertices: Vec[] = [];
    const texCoords = [];
    const faces = [];

    const dphi = 360 / sides;
    const dtheta = 180 / segments;

    const evalPos = (theta: number, phi: number) => {
      const deg = Math.PI / 180.0;
      const pos = new Vec(
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
        const texCoord = new Vec(phi / 360.0, theta / 180.0);

        vertices.push(pos);
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
          const A = segment * (sides + 1) + side;
          const B = (segment + 1) * (sides + 1) + side;
          const C = (segment + 1) * (sides + 1) + side + 1;
          const D = segment * (sides + 1) + side + 1;

          faces.push([A, B, D]);
          faces.push([B, C, D]);
        }
      }
    }
    const normals = faces.map((f) =>
      Geometry.calculateSurfaceNormal(
        vertices[f[0]],
        vertices[f[1]],
        vertices[f[2]]
      )
    );
    return new Geometry(vertices, faces, normals, texCoords);
  }
}
