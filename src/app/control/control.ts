import {KEY} from './key.enum';

type controlState = Map<KEY, boolean>;
type callBack = (data: controlState) => void;

export class Control {
  observers: callBack[] = [];
  isDown = true;
  keyMap = new Map<string, string>([
    [KEY.SPACE, 'start']
  ]);
  state: controlState = new Map<KEY, boolean>();

  constructor() {
    document.addEventListener('keydown', event => this.update(event, true));
    document.addEventListener('keyup', event => this.update(event, false));
  }

  update(e: KeyboardEvent, state: boolean) {
    if(this.keyMap.has(e.code)) {
      e.preventDefault();
      e.stopPropagation();

      this.state.set(KEY.SPACE, state);

      if(this.isDown || !state) {
        this.emitObservers();
        this.isDown = !state;
      }
    }
  }

  subscribe(cb: callBack) {
    this.observers.push(cb);
  }

  emitObservers() {
    this.observers.forEach(sub => sub(this.state));
  }
}