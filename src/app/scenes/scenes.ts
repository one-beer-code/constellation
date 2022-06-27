import {SCENE} from '../constants';
import {Scene} from '../models';

export class Scenes {
  currentScene!: Scene;
  scenes: Map<SCENE, Scene> = new Map();

  constructor(scenes: Array<Scene>) {
    // add scenes
    scenes.forEach(scene => this.addScene(scene));
  }

  addScene(scene: Scene) {
    this.scenes.set(scene.type, scene);
  }

  switchScene(type: SCENE) {
    const scene = this.scenes.get(type);
    if(scene) {
      if(scene.reset) {
        scene.reset();
      }
      scene.init();
      this.currentScene = scene;
    } else {
      throw new Error(`The scene "${type}" not found.`);
    }
  }
}