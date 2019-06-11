import { IHatsuSprite } from "./IHatsuSprite";
import { ITheater } from "./ITheater";
import { IHatsu } from "./IHatsu";

type TDrawFunc = (theater: ITheater, img: IHatsu, me: IHatsuSprite) => void;

export class HatsuSprite implements IHatsuSprite {
  private img: IHatsu;
  private drawFunc: TDrawFunc;
  private state: { [key: string]: any } = {};

  constructor(opt: { img: IHatsu, draw: TDrawFunc }) {
    this.img = opt.img;
    this.drawFunc = opt.draw;
  }

  public draw(theater: ITheater): void {
    this.drawFunc(theater, this.img, this);
  }

  public setState(key: string, value: any): void {
    this.state[key] = value;
  }

  public getState(key: string): any {
    if (!this.state.hasOwnProperty(key)) { return undefined; }
    return this.state[key];
  }
}
