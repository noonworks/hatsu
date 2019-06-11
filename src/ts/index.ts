import { Theater } from './Theater';
import { ImageBack } from './ImageBack';
import { Hatsu } from './Hatsu';
import { addSprites } from './SpriteBuilder';
import { ITheater } from './ITheater';
import { Options, IBackOptions, IHatsuOptions } from './Options';

const DEFAULT_HATSU = './img/hatsu.png';
const DEFAULT_BACK = './img/sample_back.png';

class App {
  private theater: ITheater;
  private options: Options;

  constructor() {
    this.options = new Options();
    this.theater = new Theater('main_canvas', this.options);
    const result = document.getElementById('result_area');
    if (result !== null) {
      result.append(this.theater.canvas);
    }
  }

  public async setup() {
    this.setHatsu(this.options.options.hatsu);
    this.setBack(this.options.options.back);
  }

  public start(): void {
    this.theater.start();
  }

  public onChangeOptionInputs(): void {
    const diff = this.options.diff();
    if (Object.keys(diff).length === 0) {
      return;
    }
    this.theater.pause();
    if (diff.size) {
      this.theater.setCanvasSize(diff.size);
    }
    this.theater.start();
  }

  private async setHatsu(opt: IHatsuOptions) {
    switch (opt.type) {
      case 'default':
      default:
        const h = new Hatsu();
        await h.load(DEFAULT_HATSU);
        this.theater.clearHatsu();
        addSprites(this.theater, h);
        break;
    }
  }

  private async setBack(opt: IBackOptions) {
    switch (opt.type) {
      case 'default':
      default:
        const b = new ImageBack();
        await b.load(DEFAULT_BACK);
        this.theater.clearBack();
        this.theater.addBack(b);
        break;
    }
  }
}

async function initialize() {
  const app = new App();
  const optionInputs = document.querySelectorAll('#options input');
  await app.setup();
  optionInputs.forEach(i => i.addEventListener('change', () => { app.onChangeOptionInputs(); }));
  app.start();
}

window.addEventListener('load', initialize);
