interface Background {
  color: string,
  padding: number;
}

export class Text {
  size: number;
  x: number;
  y: number;
  text: string;
  color: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  background: Background | undefined = undefined;
  animate: number = 0;
  private isAnimate = false;
  private fullText?: string;
  private index = 0;
  private timeStamp = 0;

  constructor(
    options: {
      x: number,
      y: number,
      text: string,
      size?: number,
      color?: string,
      textAlign?: CanvasTextAlign
      textBaseline?: CanvasTextBaseline
      animate?: number,
      background?: Partial<Background>
    }
  ) {
    const {size, x, color, text, y, textAlign, textBaseline, animate, background} = options;

    this.x = x;
    this.y = y;
    this.size = size || 20;
    this.color = color || '#fff';
    this.text = text;
    this.textAlign = textAlign || 'left';
    this.textBaseline = textBaseline || 'bottom';
    this.animate = animate || this.animate;

    if(background) {
      this.background = {
        color: '#000',
        padding: 0,
        ...background
      };
    }

    if (animate) {
      this.isAnimate = true;
      this.fullText = text;
      this.text = '';
      this.timeStamp = animate;
    }
  }

  update(time: number) {
    if(!this.isAnimate && !this.animate) {
      return;
    }

    const max = this.fullText!.length - 1;
    if(time >= this.timeStamp) {
      if(this.fullText && this.index <= max) {
        let currentLetter = this.fullText![this.index];
        while (currentLetter === ' ') {
          this.index++;
          currentLetter += this.fullText![this.index];
        }
        this.text += currentLetter;
        this.index++;
        if(this.index === max) {
          this.isAnimate = false;
        }
      }
      this.timeStamp = time + this.animate;
    }
  }
}
