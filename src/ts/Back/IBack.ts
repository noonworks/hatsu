import { ITheater } from "../ITheater";

export interface IBack {
  hasSideBar: boolean;
  draw(theater: ITheater): void;
}
