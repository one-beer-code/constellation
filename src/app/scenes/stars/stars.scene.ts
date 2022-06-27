import {Game, Scene} from "../../models";
import {SCENE, starColors} from "../../constants";
import {Star, Line, Text} from "../../objects";
import {getRandomInt, getRandomItem} from "../../helpers";
import * as constellation from "../../../constellations/my.json";
import * as heart from "../../../constellations/heart.json";

interface StarText extends Text {
  isShow?: boolean;
}

interface HiddenStar extends Star {
  isShow?: boolean;
}

type Constellation = {stars: Star[], lines: Line[]};

export class StarsScene implements Scene {
  type = SCENE.STARS;
  constellation!: Constellation;
  heart!: Constellation;
  nextText!: Text;
  messages: string[] = [
    'Видишь? Тут то самое созвездие. То, что даёт силы и тепло.',
    'Внимательней.',
    'Олька...',
    'Ладно, вот она',
  ];

  private isDrawText = false;
  private isDrawHeart = false;
  private stars: HiddenStar[] = [];
  private messagesArr: StarText[] = [];
  private animationStep = 1;

  constructor(
    private game: Game
  ) {

  }

  render(time: number): void {
    // draw stars
    this.stars.forEach(star => {
      if(star.isShow) {
        this.game.screen.drawStar(star);
      }
    });

    // draw text
    if(this.isDrawText) {
      this.constellation.lines.forEach(line => this.game.screen.drawLine(line));
    }
    this.constellation.stars.forEach(star => this.game.screen.drawStar(star));

    // draw heart
    if(this.isDrawHeart) {
      this.heart.lines.forEach(line => this.game.screen.drawLine(line));
    }
    this.heart.stars.forEach(star => this.game.screen.drawStar(star));

    // draw hint
    this.game.screen.drawText(this.nextText);

    //draw message
    this.messagesArr.forEach(text => {
      if(text.isShow) {
        this.game.screen.drawText(text);
      }
    });
  }

  update(time: number) {
    if(this.isDrawText) {
      this.constellation.lines.forEach(line => line.update());
    }
    if(this.isDrawHeart) {
      this.heart.lines.forEach(line => line.update());
    }

    // update text
    this.messagesArr.forEach(text => {
      if(text.isShow){
        text.update(time)
      };
    });
  }

  init() {
    this.stars = this.createStars(200);
    this.constellation = this.parseConstellation(constellation[0]);
    this.heart = this.parseConstellation(heart[0]);
    this.nextText = new Text({
      x: 10,
      y: this.game.screen.height - 10,
      text: 'Press space to continue',
      color: 'rgba(141,192,255,.6)',
      background: {
        padding: 10
      }
    });
    this.messagesArr = this.messages.map((text: string, i: number) => {
      const textItem: StarText = new Text({
        x: 10,
        y: i * 40 + 10,
        text,
        textBaseline: "top",
        animate: 50,
        background: {
          padding: 10
        }
      });
      textItem.isShow = false;
      return textItem;
    });

    this.isDrawHeart = false;
    this.isDrawText = false;
    this.animationStep = 1;
    this.setShowFlag(this.messagesArr, this.animationStep);
    this.showStar(this.stars);
  }

  onEvent(): boolean {
    let isNextScene = false;

    if(this.animationStep === this.messages.length + 1) {
      isNextScene = true;
    }

    if(this.animationStep < this.messages.length) {
      this.animationStep++;
      this.setShowFlag(this.messagesArr, this.animationStep);
    }
    if(this.animationStep === this.messages.length) {
      this.animationStep++;
      setTimeout(() => {
        this.isDrawHeart = true;
      }, 2000);
      setTimeout(() => {
        this.isDrawText = true;
      }, 1000);
    }

    return isNextScene;
  }

  private setShowFlag(arr: StarText[], index: number) {
    (new Array(index).fill('')).forEach((_, i) => {
      arr[i].isShow = true;
    });
  }

  private createStars(amount: number): HiddenStar[] {
    const stars: HiddenStar[] = [];
    for(let i = 0, x = amount; i < x; i++) {
      const star: HiddenStar = new Star({
        id: i,
        radius: getRandomInt(5, 10),
        x: getRandomInt(10, this.game.screen.width),
        y: getRandomInt(10, this.game.screen.height),
        color: getRandomItem(starColors),
      });
      star.isShow = false;
      stars.push(star);
    }
    return stars;
  }

  private parseConstellation(constellation: any): {stars: Star[], lines: Line[]} {
    const lines: Line[] = [];
    const stars: Star[] = [];

    constellation.stars.forEach((star: any) => {
      if(star.connect && star.connect.length) {
        star.connect.forEach((connectId: number) => {
          const toStar = constellation.stars.find((star: any) => star.id === connectId);
          lines.push(new Line({from: star.coordinates, to: toStar.coordinates, animate: 120}));
        });
      }
      const newStar = new Star({
        x: star.coordinates[0],
        y: star.coordinates[1],
        radius: 8,
      });
      stars.push(newStar);
    });

    return {stars, lines};
  }

  private showStar(stars: HiddenStar[]) {
    let max = stars.length - 1;
    show(0);
    function show(index: number) {
      if(index <= max) {
        setTimeout(() => {
          stars[index].isShow = true;
          index++;
          show(index);
        }, 50);
      }
    }
  }

}