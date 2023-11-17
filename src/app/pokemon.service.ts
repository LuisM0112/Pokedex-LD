import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { Pokemon } from './model/pokemon';

@Injectable({
  providedIn: 'root'
})

/** 
 * This Pokemon Service Class will be used by the pokemon-list component
 * to get the list of pokemon to be displayed
 */
export class PokemonService {

  constructor(private http: HttpClient) {}

  /**
   * This method stores in a list all the pokemon requested from the api
   * @returns Observable of an array of pokemon
   */
  fetchAllPokemon(): Observable<Pokemon[]> {
    let requests: Observable<Pokemon>[] = []; // Observable of the pokemon array
    for (let i = 1; i <= 999; i++) {
      let request = this.requestPokemon(i);
      requests.push(request);
    }

    // When every pokemon is requested it returns the array
    return forkJoin(requests).pipe(map((pokemones: Pokemon[]) => pokemones));
  }

  /**
   * This method will request the Pokeapi for the pokemon by the corresponding ID
   * @param id Id of the pokemon that is going to be requested
   * @returns Observable of a pokemon with it's attributes
   */
  requestPokemon(id: number): Observable<Pokemon> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/'+id).pipe(
      map((response: any) => ({
        id: response.id,
        spriteNormal: response.sprites.other['official-artwork'].front_default,
        spriteShiny: response.sprites.other['official-artwork'].front_shiny,
        name: response.name,
        type1: response.types[0] ? response.types[0].type.name : '',
        type2: response.types[1] ? response.types[1].type.name : '',
        height: response.height/10,
        weight: response.weight/10,
        generation: this.calculateGeneration(response.id),
        hp: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        specialAttack: response.stats[3].base_stat,
        specialDefense: response.stats[4].base_stat,
        speed: response.stats[5].base_stat,
      }))
    );
  }
  // 29
  requestPokemonDescription(id: number): Observable<Pokemon> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon-species/'+id+'/').pipe(
      map((response: any) => ({
        id: response.id,
        spriteNormal: response.sprites.other['official-artwork'].front_default,
        spriteShiny: response.sprites.other['official-artwork'].front_shiny,
        name: response.name,
        type1: response.types[0] ? response.types[0].type.name : '',
        type2: response.types[1] ? response.types[1].type.name : '',
        height: response.height/10,
        weight: response.weight/10,
        generation: this.calculateGeneration(response.id),
        hp: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        specialAttack: response.stats[3].base_stat,
        specialDefense: response.stats[4].base_stat,
        speed: response.stats[5].base_stat,
      }))
    );
  }

  private calculateGeneration(id: number): number {
    let result: number = 0;
    if (id <= 151) {
      result = 1;
    } else if (id <= 251) {
      result = 2;
    } else if (id <= 386) {
      result = 3;
    } else if (id <= 493) {
      result = 4;
    } else if (id <= 649) {
      result = 5;
    } else if (id <= 721) {
      result = 6;
    } else if (id <= 809) {
      result = 7;
    } else {
      result = 8;
    }
    return result;
  }

}

