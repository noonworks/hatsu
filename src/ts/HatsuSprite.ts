import { IHatsuSprite } from "./IHatsuSprite";
import { ITheater } from "./ITheater";
import { IHatsu } from "./IHatsu";

type TDrawFunc = (theater: ITheater, img: IHatsu) => void;

export class HatsuSprite implements IHatsuSprite {
  private img: IHatsu;
  private drawFunc: TDrawFunc;

  constructor(opt: { img: IHatsu, draw: TDrawFunc }) {
    this.img = opt.img;
    this.drawFunc = opt.draw;
  }

  public draw(theater: ITheater): void {
    this.drawFunc(theater, this.img);
  }
}
