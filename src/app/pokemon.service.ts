import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
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

  // requestFullPokemon(id: number): Observable<FullPokemon> {
  //   return forkJoin({
  //     basicInfo: this.requestBasicPokemon(id),
  //     description: this.requestPokemonDescription(id),
  //     pokemonDetails: this.http.get(this.urlPokemon + id).pipe(
  //       map((response: any) => ({
  //         height: response.height / 10,
  //         weight: response.weight / 10,
  //         hp: response.stats[0].base_stat,
  //         attack: response.stats[1].base_stat,
  //         defense: response.stats[2].base_stat,
  //         specialAttack: response.stats[3].base_stat,
  //         specialDefense: response.stats[4].base_stat,
  //         speed: response.stats[5].base_stat,
  //       }))
  //     ),
  //   }).pipe(
  //     map((data: any) => ({...data.basicInfo, description: data.description, ...data.pokemonDetails,}) as FullPokemon)
  //   );
  // }

  // requestFullPokemon(id: number): Observable<FullPokemon> {
  //   return forkJoin({
  //     basicInfo: this.requestBasicPokemon(id),
  //     descriptionAndEvolutionUrl: this.requestPokemonDescription(id),
  //     pokemonDetails: this.http.get(this.urlPokemon + id).pipe(
  //       map((response: any) => ({
  //         height: response.height / 10,
  //         weight: response.weight / 10,
  //         hp: response.stats[0].base_stat,
  //         attack: response.stats[1].base_stat,
  //         defense: response.stats[2].base_stat,
  //         specialAttack: response.stats[3].base_stat,
  //         specialDefense: response.stats[4].base_stat,
  //         speed: response.stats[5].base_stat,
  //       }))
  //     ),
  //   }).pipe(
  //     map((data: any) => {
  //       let { basicInfo, descriptionAndEvolutionUrl, pokemonDetails } = data;
  //       let { description, evolutionUrl } = descriptionAndEvolutionUrl;
  
  //       // Hacer la solicitud para obtener la cadena evolutiva
  //       return {
  //         ...basicInfo,
  //         description,
  //         ...pokemonDetails,
  //         evolutionChain: this.getPokemonEvolutionChain(evolutionUrl)
  //       } as FullPokemon;
  //     })
  //   );
  // }

  requestFullPokemon(id: number): Observable<FullPokemon> {
    return this.requestPokemonDescription(id).pipe(
      switchMap((descriptionAndEvolutionUrl: any) => {
        let evolutionUrl = descriptionAndEvolutionUrl.evolutionUrl;
        let basicInfo$ = this.requestBasicPokemon(id);
        let pokemonDetails$ = this.http.get(`${this.urlPokemon}${id}`).pipe(
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
        );
        let evolutionChain$ = this.getPokemonEvolutionChain(evolutionUrl);

        return forkJoin({
          basicInfo: basicInfo$,
          pokemonDetails: pokemonDetails$,
          evolutionChain: evolutionChain$
        }).pipe(
          map((data: any) => {
            let { basicInfo, pokemonDetails, evolutionChain } = data;
            let { description } = descriptionAndEvolutionUrl;

            return {
              ...basicInfo,
              description,
              ...pokemonDetails,
              evolutionChain
            } as FullPokemon;
          })
        );
      })
    );
  }


  // requestPokemonDescription(id: number): Observable<string> {
  //   return this.http.get(this.urlSpecies + id + '/').pipe(
  //     map((response: any) => {
  //       let descriptionObj = response.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
  //       let description = descriptionObj ? descriptionObj.flavor_text : 'No description available';
        
  //       // Limpiar la descripción: eliminar caracteres especiales y saltos de línea
  //       description = description.replace(/[\r\n\t\f\v]/g, " ");

  //       return description;
  //     })
  //   );
  // }

  requestPokemonDescription(id: number): Observable<{ description: string, evolutionUrl: string }> {
    return this.http.get(this.urlSpecies + id + '/').pipe(
      map((response: any) => {
        let descriptionObj = response.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
        let description = descriptionObj ? descriptionObj.flavor_text : 'No description available';
        description = description.replace(/[\r\n\t\f\v]/g, " ");
  
        let evolutionUrl = response.evolution_chain.url;
        console.log(evolutionUrl)
  
        return { description, evolutionUrl };
      })
    );
  }

  

  // requestFullPokemon(id: number): Observable<FullPokemon> {
  //   return forkJoin({
  //     basicInfo: this.requestBasicPokemon(id),
  //     descriptionAndEvolutionUrl: this.requestPokemonDescription(id),
  //     pokemonDetails: this.http.get(this.urlPokemon + id).pipe(
  //       map((response: any) => ({
  //         height: response.height / 10,
  //         weight: response.weight / 10,
  //         hp: response.stats[0].base_stat,
  //         attack: response.stats[1].base_stat,
  //         defense: response.stats[2].base_stat,
  //         specialAttack: response.stats[3].base_stat,
  //         specialDefense: response.stats[4].base_stat,
  //         speed: response.stats[5].base_stat,
  //       }))
  //     ),
  //   }).pipe(
  //     switchMap((data: any) => {
  //       let { basicInfo, descriptionAndEvolutionUrl, pokemonDetails } = data;
  //       let { description, evolutionUrl } = descriptionAndEvolutionUrl;
  
  //       return this.getPokemonEvolutionChain(evolutionUrl).pipe(
  //         map((evolutionChain: any[]) => {
  //           const pokemonChain: string[] = [];
  //           const evolutionRequirements: string[] = [];
  
  //           const traverseChain = (chain: any) => {
  //             if (chain.species && chain.species.name) {
  //               pokemonChain.push(chain.species.name);
  //             }
  
  //             if (chain.evolution_details && chain.evolution_details.length > 0) {
  //               const details = chain.evolution_details[0];
  //               const reqString = this.parseEvolutionDetails(details);
  //               if (reqString) {
  //                 evolutionRequirements.push(reqString);
  //               }
  //             }
  
  //             if (chain.evolves_to && chain.evolves_to.length > 0) {
  //               for (const nextEvolution of chain.evolves_to) {
  //                 traverseChain(nextEvolution);
  //               }
  //             }
  //           };
  
  //           // Traverse the evolution chain
  //           traverseChain(evolutionChain[0]);
  
  //           return {
  //             ...basicInfo,
  //             description,
  //             ...pokemonDetails,
  //             evolutionChain: pokemonChain,
  //             evolutionRequirements,
  //           } as FullPokemon;
  //         })
  //       );
  //     })
  //   );
  // }
  
  // parseEvolutionDetails(details: any): string {
  //   let reqString = '';
  
  //   if (details) {
  //     if (details.min_level !== null) {
  //       reqString += `Level ${details.min_level}`;
  //     }
  
  //     if (details.item && details.item.name) {
  //       reqString += ` holding ${details.item.name.replace(/-/g, ' ')}`;
  //     }
  
  //     if (details.time_of_day) {
  //       reqString += ` during ${details.time_of_day}`;
  //     }
  
  //     if (details.location && details.location.name) {
  //       reqString += ` at ${details.location.name.replace(/-/g, ' ')}`;
  //     }
  
  //   }
  
  //   return reqString.trim();
  // }

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

  /* //////////////////////////////////////////////////////////////// */

  requestEvolutionChain(evolutionUrl: string): Observable<any> {
    return this.http.get(evolutionUrl);
  }

  // getPokemonEvolutionChain(evolutionUrl: string): Observable<any[]> {
  //   return this.requestEvolutionChain(evolutionUrl).pipe(
  //     map((response: any) => {
  //       let pokemonChain: any[] = [];
  //       this.traverseEvolutionChain(response.chain, pokemonChain);
  //       return pokemonChain;
  //     })
  //   );
  // }
  
  // traverseEvolutionChain(chain: any, result: any[]) {
  //   let currentPokemon = {
  //     speciesName: chain.species.name,
  //     evolutionDetails: chain.evolution_details
  //   };
  
  //   result.push(currentPokemon);
  
  //   if (chain.evolves_to && chain.evolves_to.length > 0) {
  //     for (let nextEvolution of chain.evolves_to) {
  //       this.traverseEvolutionChain(nextEvolution, result);
  //     }
  //   }
  // }
  
  // const evolutionUrl = 'https://pokeapi.co/api/v2/evolution-chain/1/';
  // this.getPokemonEvolutionChain(evolutionUrl).subscribe((pokemonChain: any[]) => {
  //   console.log(pokemonChain);
  // });

  getPokemonEvolutionChain(evolutionUrl: string): Observable<any[]> {
    return this.requestEvolutionChain(evolutionUrl).pipe(
      map((response: any) => {
        let pokemonChain: any[] = [];
        this.traverseEvolutionChain(response.chain, pokemonChain);
        return pokemonChain;
      })
    );
  }
  
  traverseEvolutionChain(chain: any, result: any[]) {
    let currentPokemon = {
      speciesName: chain.species.name,
      evolutionDetails: chain.evolution_details
    };
  
    result.push(currentPokemon);
  
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      for (let nextEvolution of chain.evolves_to) {
        this.traverseEvolutionChain(nextEvolution, result);
      }
    }
  }
}
