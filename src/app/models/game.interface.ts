import {Screen} from "../screen";
import {Control} from "../control";
import {Scenes} from "../scenes";

export interface Game {
  screen: Screen;
  scenes: Scenes;
  control: Control;
}