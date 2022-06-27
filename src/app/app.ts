import {Screen} from "./screen";
import {CoordinatesScene, Scenes, StarsScene, TextScene, WelcomeScene} from "./scenes";
import {Game} from "./models";
import {Control, KEY} from "./control";
import {SCENE} from "./constants";

export default class App implements Game {
  screen: Screen;
  scenes: Scenes;
  control: Control;
  scenesOrder: SCENE[] = [SCENE.WELCOME, SCENE.TEXT, SCENE.STARS];

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    this.control = new Control();
    this.screen = new Screen(canvas);

    // set scenes
    this.scenes = new Scenes([
      new WelcomeScene(this),
      new StarsScene(this),
      new CoordinatesScene(this),
      new TextScene(this)
    ]);

    //set default scene
    this.scenes.switchScene(this.scenesOrder[0]);

    // init keyboard
    this.keyboard();
  }

  private render() {
    let animationId: number;
    let timer = 0;
    const interval = 1000/60;
    let lastTime = 0;

    const animate = (timeStamp: number = 0) => {
        const deltaTime = timeStamp - lastTime || 0;
        lastTime = timeStamp;

        if(timer > interval) {
          this.screen.clearScreen();
          if(this.scenes.currentScene.update) {
            this.scenes.currentScene.update(timeStamp);
          }
          this.scenes.currentScene.render(timeStamp);
        } else {
          timer += deltaTime;
        }

        animationId = requestAnimationFrame(animate.bind(this));
    }
    animate();
  }
  run() {
    this.render();
  }
  keyboard() {
    this.control.subscribe(state => {
      const isSpaceDown = state.get(KEY.SPACE);
      if(isSpaceDown) {
        const currentIndex = this.scenesOrder.indexOf(this.scenes.currentScene.type);
        const nextScene = this.scenesOrder[currentIndex + 1];
        let isNext = true;

        if(this.scenes.currentScene.type === SCENE.STARS) {
          if(this.scenes.currentScene.onEvent) {
            isNext = this.scenes.currentScene.onEvent();
          }
        }

        if(!isNext) {
          return;
        }

        if(nextScene) {
          this.scenes.switchScene(nextScene);
        } else {
          this.scenes.switchScene(SCENE.WELCOME);
        }
      }
    });
  }
}