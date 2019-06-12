import { ITheater } from "../ITheater";

export interface IHatsu {
  end: number;
  draw(theater: ITheater): void;
}
