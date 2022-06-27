import {Line} from "../../../objects";
import {Screen} from "../../../screen";

export class Aim {
  x: Line;
  y: Line;
  color = 'green';

  constructor(
    private screen: Screen
  ) {
    const {width, height} = screen;
    this.x = new Line({
      from: [0, 0],
      to: [ width, 0],
      color: this.color
    });
    this.y = new Line({
      from: [0, 0],
      to: [ 0, height],
      color: this.color
    })
  }

  draw() {
    this.screen.drawLine(this.x);
    this.screen.drawLine(this.y);
  }
  update(x: number, y: number) {
    this.x.from[1] = y;
    this.x.to[1] = y;
    this.y.from[0] = x;
    this.y.to[0] = x;
  }
}