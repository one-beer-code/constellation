import {SCENE} from '../constants';

export interface Scene {
  type: SCENE;
  render(time: number): void;
  init(): void;
  update?(time: number): void;
  reset?(): void;
  onEvent?(): boolean;
}