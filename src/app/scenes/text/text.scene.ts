import {Game, Scene} from "../../models";
import {SCENE, starColors} from "../../constants";
import {Star, Text} from "../../objects";
import {getRandomInt, getRandomItem} from "../../helpers";

export class TextScene implements Scene{
  type = SCENE.TEXT
  text: Text[] = [];
  textRows: string[] = [
    '"Если Вселенная бесконечна действительно" ©NoizeMc',
    'Вселенная бесконечная. Звёзд не счесть. Звёзды, планеты, галактики.',
    'Представим, что Земля - это наша вселенная, а звёзды - это люди.',
    'Каждый сияет по-своему, начиная с карликов и заканчивая гигантами.',
    'Каждый уникален. У каждого своя история. И каждый когда-то вспыхнул и когда-то погаснет.',
    'Среди этих звёзд, я нашёл целое созвездие.',
    'Стоит только присмотреться и можно увидеть те звёздочки, которые меня вдохновляют.',
    'То созвездие, ради которой готов не всё.',
  ];
  nextText!: Text;
  stars: Star[] = [];

  constructor(
    private game: Game
  ) {
    this.init();
  }

  render(time: number): void {
    this.stars.forEach(star => this.game.screen.drawStar(star));
    this.text.forEach(text => this.game.screen.drawText(text));
    // draw hint
    this.game.screen.drawText(this.nextText);
  }

  update(time: number): void {
    this.text.forEach(text => text.update(time));
  }

  init() {
    this.text = this.textRows.map((text: string, i: number) => {
      return new Text({
        x: 20,
        y: i * 50 + 20,
        size: 30,
        animate: getRandomInt(1, 4) * 10,
        textBaseline: "top",
        text,
        background: {
          color: '#000',
          padding: 10
        }
      })
    });
    this.nextText = new Text({
      x: 10,
      y: this.game.screen.height - 10,
      text: 'Press space to continue',
      color: 'rgba(141,192,255,.6)',
      background: {
        padding: 10
      }
    });
    this.stars = this.createStars(200);
  }

  private createStars(amount: number): Star[] {
    const stars: Star[] = [];
    for(let i = 0, x = amount; i < x; i++) {
      stars.push(new Star({
        id: i,
        radius: getRandomInt(5, 10),
        x: getRandomInt(10, this.game.screen.width),
        y: getRandomInt(10, this.game.screen.height),
        color: getRandomItem(starColors),
      }))
    }
    return stars;
  }
}