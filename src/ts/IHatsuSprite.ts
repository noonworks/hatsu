import { ITheater } from "./ITheater";

export interface IHatsuSprite {
  draw(theater: ITheater): void;
  setState(key: string, value: any): void;
  getState(key: string): any;
}
