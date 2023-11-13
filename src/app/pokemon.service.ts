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
        sprite: response.sprites.other['official-artwork'].front_default,
        name: response.name,
        type1: response.types[0] ? response.types[0].type.name : '',
        type2: response.types[1] ? response.types[1].type.name : '',
        height: response.height/10,
        weight: response.weight/10,
        generation: this.calculateGeneration(response.id),
      }))
    );
  }

  private calculateGeneration(id: number): number {
    if (id <= 151) {
      return 1;
    } else if (id <= 251) {
      return 2;
    } else if (id <= 386) {
      return 3;
    } else if (id <= 493) {
      return 4;
    } else if (id <= 649) {
      return 5;
    } else if (id <= 721) {
      return 6;
    } else if (id <= 809) {
      return 7;
    } else {
      return 8;
    }
  }

}

