import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { BasicPokemon } from './interface/basic-pokemon';
import { FullPokemon } from './interface/full-pokemon';

import * as jsonGens from '../assets/data/generationsData.json';

/** 
 * This Pokemon Service Class will be used by the pokemon-list, pokemon-details components
 * to get the list of pokemon and the data to be displayed
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  gensData: any = jsonGens;
  generationLimits: number[] = this.gensData.generations.map((gen: any) => gen.limit);

  urlPokemon: string = 'https://pokeapi.co/api/v2/pokemon/';
  urlSpecies: string = 'https://pokeapi.co/api/v2/pokemon-species/';

  constructor(private http: HttpClient) {}

  /**
   * This method stores in a list all the pokemon requested from the api
   * @returns Observable of an array of pokemon
   */
  fetchAllPokemon(): Observable<BasicPokemon[]> {
    let requests: Observable<BasicPokemon>[] = []; // Observable of the pokemon array
    for (let i = 1; i <= 999; i++) {
      let request = this.requestBasicPokemon(i);
      requests.push(request);
    }

    // When every pokemon is requested it returns the array
    return forkJoin(requests).pipe(map((pokemones: BasicPokemon[]) => pokemones));
  }

  requestBasicPokemon(id: number): Observable<BasicPokemon> {
    return this.http.get(this.urlPokemon + id).pipe(
      map((response: any) => ({
        id: response.id,
        spriteNormal: response.sprites.other['official-artwork'].front_default,
        spriteShiny: response.sprites.other['official-artwork'].front_shiny,
        name: response.name,
        generation: this.getGeneration(response.id),
        type1: response.types[0] ? response.types[0].type.name : '',
        type2: response.types[1] ? response.types[1].type.name : '',
      }))
    );
  }

  requestFullPokemon(id: number): Observable<FullPokemon> {
    return forkJoin({
      basicInfo: this.requestBasicPokemon(id),
      description: this.requestPokemonDescription(id),
      pokemonDetails: this.http.get(this.urlPokemon + id).pipe(
        map((response: any) => ({
          height: response.height / 10,
          weight: response.weight / 10,
          hp: response.stats[0].base_stat,
          attack: response.stats[1].base_stat,
          defense: response.stats[2].base_stat,
          specialAttack: response.stats[3].base_stat,
          specialDefense: response.stats[4].base_stat,
          speed: response.stats[5].base_stat,
        }))
      ),
    }).pipe(
      map((data: any) => ({...data.basicInfo, description: data.description, ...data.pokemonDetails,}) as FullPokemon)
    );
  }

  requestPokemonDescription(id: number): Observable<string> {
    return this.http.get(this.urlSpecies + id + '/').pipe(
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
