import { BasicPokemon } from "./basic-pokemon";
import { LearnedMove } from "./learned-move";

export class FullPokemon extends BasicPokemon {
  description: string = '';
  height: number = 0;
  weight: number = 0;
  hp: number = 0;
  attack: number = 0;
  defense: number = 0;
  specialAttack: number = 0;
  specialDefense: number = 0;
  speed: number = 0;
  evolutionChain: any[] = [];
  learnedMoves: LearnedMove[] = []
}
