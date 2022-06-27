import {Game, Scene} from "../../models";
import {SCENE} from "../../constants";
import {Line, Star, Text} from "../../objects";
import {Aim} from "./objects/aim";

type Grid = [{text: Text, line: Line}[], {text: Text, line: Line}[]];

export class CoordinatesScene implements Scene{
  type = SCENE.COORDINATES;
  gridParams: [number, number] = [50, 50];
  lineWidth = 5;
  color = '#1a2546';
  grid: Grid;
  aim: Aim;
  points: {text: Text, point: Star}[] = [];

  constructor(
    private game: Game
  ) {
    this.grid = this.createGrid();

    this.aim = new Aim(this.game.screen);
    this.game.screen.canvas.addEventListener('mousemove', this.updateCursor.bind(this));
    this.game.screen.canvas.addEventListener('click', this.addPoint.bind(this));
  }

  render(time: number): void {
    // draw grid
    this.grid.forEach(lines => {
      lines.forEach(line => {
        this.game.screen.drawLine(line.line);
        this.game.screen.drawText(line.text);
      });
    });

    //draw aim
    this.aim.draw();

    //draw points
    this.points.forEach(point => {
      this.game.screen.drawText(point.text);
      this.game.screen.drawStar(point.point);
    });
  }

  update(time: number) {

  }

  init() {

  }

  createGrid(): Grid {
    const xAmount = this.game.screen.width / this.gridParams[0];
    const yAmount = this.game.screen.height / this.gridParams[1];
    let xGrid = [];
    let yGrid = [];

    for(let i = 0, x = xAmount;  i < x; i++) {
      let delta = i * this.gridParams[0];
      yGrid.push({
        text: new Text({x: delta, y: 0, text: `${i * this.gridParams[0]}`, textAlign: "left", textBaseline: "top", size: 15}),
        line: new Line({
          from: [ delta, 0],
          to: [ delta, this.game.screen.height],
          color: this.color
        })
      });
    }
    for(let i = 0, x = yAmount;  i < x; i++) {
      let delta = i * this.gridParams[1];
      xGrid.push({
        text: new Text({x: 0, y: delta, text: `${delta}`, textBaseline: "top", size: 15}),
        line: new Line({
          from: [0, delta],
          to: [this.game.screen.width, delta],
          color: this.color
        })
      });
    }
    return [xGrid, yGrid];
  }

  updateCursor(e: any) {
    this.aim.update(e.x - e.target.offsetLeft, e.y - e.target.offsetTop);
  }

  addPoint(e: any) {
    let [x, y] = [e.x - e.target.offsetLeft, e.y - e.target.offsetTop];
    this.points.push({
      text: new Text({x, y, text: `${x} - ${y}`}),
      point: new Star({x, y})
    });
  }

  private roundCoordinates(c: number): number{
    return (Math.round(c / 10)) * 10;
  }
}