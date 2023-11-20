import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { Pokemon } from './model/pokemon';

import * as jsonGens from '../assets/data/generationsData.json';

@Injectable({
  providedIn: 'root'
})

/** 
 * This Pokemon Service Class will be used by the pokemon-list component
 * to get the list of pokemon to be displayed
 */
export class PokemonService {

  gensData: any = jsonGens;
  generationLimits: number[] = this.gensData.generations.map((gen: any) => gen.limit);

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

  fetchPokemon(id: number): Observable<Pokemon> {
    return this.requestPokemon(id).pipe(
      switchMap((pokemon: Pokemon) => {
        return this.requestPokemonDescription(id).pipe(
          map((description: string) => {
            pokemon.description = description;
            return pokemon;
          })
        );
      })
    );
  }

  /**
   * This method will request the PokeApi for the pokemon by the corresponding ID
   * @param id Id of the pokemon that is going to be requested
   * @returns Observable of a pokemon with it's attributes
   */
  requestPokemon(id: number): Observable<Pokemon> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      map((response: any) => ({
        id: response.id,
        spriteNormal: response.sprites.other['official-artwork'].front_default,
        spriteShiny: response.sprites.other['official-artwork'].front_shiny,
        name: response.name,
        description: '',
        type1: response.types[0] ? response.types[0].type.name : '',
        type2: response.types[1] ? response.types[1].type.name : '',
        height: response.height/10,
        weight: response.weight/10,
        generation: this.getGeneration(response.id),
        hp: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        specialAttack: response.stats[3].base_stat,
        specialDefense: response.stats[4].base_stat,
        speed: response.stats[5].base_stat,
      }))
    );
  }

  requestPokemonDescription(id: number): Observable<string> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).pipe(
      map((response: any) => {
        let descriptionObj = response.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
        let description = descriptionObj ? descriptionObj.flavor_text : 'No description available';
        
        // Limpiar la descripción: eliminar caracteres especiales y saltos de línea
        description = description.replace(/[\r\n\t\f\v]/g, " ");

        return description;
      })
    );
  }

  private getGeneration(id: number): number {
    let result: number = 0;
    for (let i = 0; i < this.generationLimits.length; i++) {
      if (id <= this.generationLimits[i]) {
        result = i + 1;
        break;
      }
    }
    return result;
  }
}
