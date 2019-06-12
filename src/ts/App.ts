import { ImageBack } from './Back/ImageBack';
import { ITheater } from './ITheater';
import { Theater } from './Theater';
import { Options, IBackOptions, IHatsuOptions } from './Options';
import { HatsuImage } from './Hatsu/HatsuImage';
import { addAllHatsus } from './Hatsu/Builder';

const DEFAULT_HATSU = './img/hatsu.png';
const DEFAULT_BACK = './img/sample_back.png';

export default class App {
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

  public stop(): void {
    this.theater.stop();
  }

  public async onChangeOptionInputs() {
    const diff = this.options.diff();
    if (Object.keys(diff).length === 0) {
      return;
    }
    this.theater.pause();
    if (diff.size) {
      this.theater.setCanvasSize(diff.size);
    }
    if (diff.hatsu) {
      await this.setHatsu(diff.hatsu);
    }
    if (diff.back) {
      await this.setBack(diff.back);
    }
    this.theater.start();
  }

  private async setHatsu(opt: IHatsuOptions) {
    const h = new HatsuImage();
    switch (opt.type) {
      case 'file':
        if (opt.file) {
          await h.loadFile(opt.file);
        } else {
          return;
        }
        break;
      case 'default':
      default:
        await h.load(DEFAULT_HATSU);
        break;
    }
    this.theater.clearHatsu();
    addAllHatsus(this.theater, h);
  }

  private async setBack(opt: IBackOptions) {
    const ib = new ImageBack();
    switch (opt.type) {
      case 'image':
        if (opt.file) {
          await ib.loadFile(opt.file);
        } else {
          return;
        }
        break;
      case 'default':
      default:
        await ib.load(DEFAULT_BACK);
        break;
    }
    this.theater.clearBack();
    this.theater.addBack(ib);
  }
}
