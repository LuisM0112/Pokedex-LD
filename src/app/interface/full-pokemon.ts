import { BasicPokemon } from "./basic-pokemon";

export interface FullPokemon extends BasicPokemon {
  description: string;
  height: number;
  weight: number;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}
