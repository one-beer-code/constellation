import {Game, Scene} from '../../models';
import {SCENE} from '../../constants';
import {Text} from '../../objects';

export class WelcomeScene implements Scene {
  type = SCENE.WELCOME
  welcomeText!: Text;

  constructor(
    private game: Game
  ) {
    this.init();
  }

  render(time: number): void {
    this.game.screen.drawText(this.welcomeText);
  }

  update(time: number): void {
    this.welcomeText.update(time);
  }

  init() {
    this.welcomeText = new Text({
      text: 'PRESS SPACE TO START',
      color: '#7fddff',
      size: 50,
      x: 10,
      y: 10,
      textBaseline: 'top',
      animate: 50
    });
  }
}