import App from './app/app';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
if(canvas) {
  const app = new App(canvas);
  app.run();
}
