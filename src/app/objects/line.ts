type Coordinates = [number, number];

export class Line {
  color = '#fff';
  width = 2;
  animate?: number;
  from: Coordinates;
  to: Coordinates;
  private toXY?: Coordinates;
  private deltas?: Coordinates;
  private directions?: [boolean, boolean];
  private isAnimate = true;

  constructor(
    options: {
      from: Coordinates,
      to: Coordinates,
      width?: number,
      color?: string,
      animate?: number
    }
  ) {
    const {from, color, width, to, animate} = options;
    this.from = [...from];
    this.to = [...to];
    if(color) {
      this.color = color;
    }
    if(width) {
      this.width = width;
    }
    if(animate) {
      this.animate = animate;
      this.to = [...from];
      this.toXY = [...to];
      this.deltas = this.setDeltas(from, to);
      this.directions = Line.setDirections(from, to);
    }
  }

  update() {
    if(this.animate && this.deltas && this.isAnimate) {
      this.to[0] = Line.setCoordinate(this.to[0], this.deltas![0], this.directions![0]);
      this.to[1] = Line.setCoordinate(this.to[1], this.deltas![1], this.directions![1]);

      this.isAnimate = !(Line.isFinish(this.to[0], this.toXY![0], this.directions![0]) && Line.isFinish(this.to[1], this.toXY![1], this.directions![1]));
    }
  }

  private setDeltas(from: Coordinates, to: Coordinates): Coordinates {
    const deltaX = Math.abs(from[0] - to[0]) / this.animate!;
    const deltaY = Math.abs(from[1] - to[1]) / this.animate!;

    return [deltaX, deltaY];
  }
  private static setDirections(from: Coordinates, to: Coordinates): [boolean, boolean]{
    return [
      from[0] > to[0],
      from[1] > to[1],
    ]
  }
  private static setCoordinate(coordinate: number, delta: number, direction: boolean) {
    return direction ? coordinate -= delta : coordinate += delta;
  }
  private static isFinish(startPoint: number, endPoint: number, direction: boolean) {
    return direction ? startPoint <= endPoint : startPoint >= endPoint;
  }
}