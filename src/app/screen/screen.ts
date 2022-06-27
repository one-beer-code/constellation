import {Text} from '../objects/text';
import {Star, Line} from "../objects";

export class Screen {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(
    public canvas: HTMLCanvasElement
  ) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawText(textObj: Text) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.font = `${textObj.size}px sans-serif`;
    this.ctx.fillStyle = textObj.color;
    this.ctx.textBaseline = textObj.textBaseline;
    this.ctx.textAlign = textObj.textAlign;

    // draw background
    if(textObj.background) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = textObj.background.color;
      this.ctx.fillRect(
        textObj.x - textObj.background.padding,
        textObj.textBaseline === 'top' ? textObj.y - textObj.background.padding : textObj.y - textObj.size - textObj.background.padding,
        this.ctx.measureText(textObj.text).width + textObj.background.padding * 2,
        textObj.size + textObj.background.padding * 2
      );
      this.ctx.closePath();
      this.ctx.restore();
    }

    this.ctx.fillText(textObj.text, textObj.x, textObj.y);
    this.ctx.closePath();
    this.ctx.restore();
  }

  drawStar(star: Star) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = star.color;
    this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  drawLine(line: Line) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = line.color;
    this.ctx.lineWidth = line.width;
    this.ctx.moveTo(line.from[0], line.from[1]);
    this.ctx.lineTo(line.to[0], line.to[1]);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }
}