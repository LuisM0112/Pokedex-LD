import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokemonIdFormat'
})
export class PokemonIdFormatPipe implements PipeTransform {
  transform(pokemonId: number, ...args: unknown[]): string {
    return isNaN(pokemonId)? "Invalid Input" : pokemonId.toString().padStart(3, '0');
  }
}
