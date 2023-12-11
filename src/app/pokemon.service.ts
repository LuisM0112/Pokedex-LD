import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'
import { BasicPokemon } from './model/basic-pokemon';
import { FullPokemon } from './model/full-pokemon';
import { Move } from './model/move';
import { Evolution } from './interface/evolution';
import { LearnedMove } from './model/learned-move';

import * as jsonTypes from '../assets/data/typesData.json';
import * as jsonGens from '../assets/data/generationsData.json';

/** 
 * This Pokemon Service Class will be used by the pokemon-list, pokemon-details components
 * to get the list of pokemon and the data to be displayed
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  typesData: any = jsonTypes; // Contains the data for each type (name, color, effectiveness)
  gensData: any = jsonGens;   // Contains the data for each generation (name, color, limit)

  generationLimits: number[] = this.gensData.generations.map((gen: any) => gen.limit);

  urlPokemon: string = 'https://pokeapi.co/api/v2/pokemon/';
  urlSpecies: string = 'https://pokeapi.co/api/v2/pokemon-species/';
  urlMove: string = 'https://pokeapi.co/api/v2/move/';

  constructor(private http: HttpClient) {}

  /**
   * This method stores in a list all the pokemon requested from the api
   * @returns Observable of an array of pokemon
   */
  fetchAllPokemon(): Observable<BasicPokemon[]> {
    let requests: Observable<BasicPokemon>[] = []; // Observable of the pokemon array
    for (let i = 1; i <= 493; i++) {
      let request = this.requestBasicPokemon(i+"");
      requests.push(request);
    }

    // When every pokemon is requested it returns the array
    return forkJoin(requests).pipe(map((pokemones: BasicPokemon[]) => pokemones));
  }

  fetchEvolutions(evolutionChain: Evolution[]): Observable<BasicPokemon[]> {
    let requests: Observable<BasicPokemon>[] = evolutionChain.map(evolution =>
      this.requestBasicPokemon(evolution.name)
    );
    
    // When every pokemon evolution is requested it returns the array
    return forkJoin(requests);
  }

  requestBasicPokemon(value: string): Observable<BasicPokemon> {
    return this.http.get(this.urlPokemon + value).pipe(
      map((response: any) => ({
        pokemonId: response.id,
        spriteNormal: response.sprites.other['official-artwork'].front_default,
        spriteShiny: response.sprites.other['official-artwork'].front_shiny,
        name: response.name,
        generation: this.getGeneration(response.pokemonId),
        type1: response.types[0] ? response.types[0].type.name : '',
        type2: response.types[1] ? response.types[1].type.name : '',
      }))
    );
  }

  requestFullPokemon(pokemonId: string): Observable<FullPokemon> {
    return this.requestPokemonDescription(pokemonId).pipe(
      switchMap((descriptionAndEvolutionUrl: any) => {
        let evolutionUrl = descriptionAndEvolutionUrl.evolutionUrl;
        let basicInfo$ = this.requestBasicPokemon(pokemonId + '');
        let pokemonDetails$ = this.getPokemonDetails(pokemonId);
        let evolutionChain$ = this.getPokemonEvolutionChain(evolutionUrl);
  
        return forkJoin({
          basicInfo: basicInfo$,
          pokemonDetails: pokemonDetails$,
          evolutionChain: evolutionChain$,
        }).pipe(
          map((data: any) => {
            let { basicInfo, pokemonDetails, evolutionChain } = data;
            let { description } = descriptionAndEvolutionUrl;
  
            let learnedMoves = this.filterLearnedMoves(pokemonDetails.learnedMoves);
  
            return {
              ...basicInfo,
              description,
              ...pokemonDetails,
              evolutionChain,
              learnedMoves,
            } as FullPokemon;
          })
        );
      })
    );
  }
  
  private getPokemonDetails(pokemonId: string): Observable<any> {
    return this.http.get(`${this.urlPokemon}${pokemonId}`).pipe(
      map((response: any) => ({
        height: response.height / 10,
        weight: response.weight / 10,
        hp: response.stats[0].base_stat,
        attack: response.stats[1].base_stat,
        defense: response.stats[2].base_stat,
        specialAttack: response.stats[3].base_stat,
        specialDefense: response.stats[4].base_stat,
        speed: response.stats[5].base_stat,
        learnedMoves: response.moves,
      }))
    );
  }
  
  private filterLearnedMoves(moves: any[]): LearnedMove[] {
    return moves
      .filter((move: any) =>
        move.version_group_details.some(
          (details: any) =>
            details.version_group.name === 'diamond-pearl' &&
            details.move_learn_method.name !== 'egg' &&
            details.move_learn_method.name !== 'tutor'
        )
      )
      .map((move: any) => ({
        name: move.move.name,
        learnLevel: move.version_group_details.find((details: any) => details.version_group.name === 'platinum').level_learned_at,
        learnMethod: move.version_group_details.find((details: any) => details.version_group.name === 'platinum').move_learn_method.name,
      }));
  }

  requestPokemonDescription(pokemonId: string): Observable<{ description: string, evolutionUrl: string }> {
    const language = localStorage.getItem('language') === 'es' ? 'es' : 'en';
  
    return this.http.get(this.urlSpecies + pokemonId + '/').pipe(
      map((response: any) => {
        let descriptionObj = response.flavor_text_entries.find((entry: any) => entry.language.name === language);
        let description = descriptionObj ? descriptionObj.flavor_text : 'No description available';
        description = description.replace(/[\r\n\t\f\v]/g, " ");
  
        let evolutionUrl = response.evolution_chain.url;
  
        return { description, evolutionUrl };
      })
    );
  }

  /**
   * Retrieves the generation number based on the provided ID.
   * @param {number} pokemonId - The ID for which to determine the generation.
   * @returns The generation number corresponding to the provided ID.
   *          Returns 0 if no generation matches the ID.
   */
  private getGeneration(pokemonId: number): number {
    let index = this.generationLimits.findIndex((limit) => pokemonId <= limit);
    return index != -1 ? index + 1 : 0;
  }

  requestEvolutionChain(evolutionUrl: string): Observable<any> {
    return this.http.get(evolutionUrl);
  }

  getPokemonEvolutionChain(evolutionUrl: string): Observable<Evolution[]> {
    return this.requestEvolutionChain(evolutionUrl).pipe(
      map((response: any) => {
        let pokemonChain: Evolution[] = [];
        this.traverseEvolutionChain(response.chain, pokemonChain);
        return pokemonChain;
      })
    );
  }
  
  traverseEvolutionChain(chain: any, result: Evolution[]) {
    let currentPokemon: Evolution = {
      name: chain.species.name,
      gender: chain.evolution_details[0]?.gender,
      held_item: chain.evolution_details[0]?.held_item?.name,
      item: chain.evolution_details[0]?.item?.name,
      known_move: chain.evolution_details[0]?.known_move?.name,
      known_move_type: chain.evolution_details[0]?.known_move_type?.name,
      location: chain.evolution_details[0]?.location?.name,
      min_affection: chain.evolution_details[0]?.min_affection,
      min_beauty: chain.evolution_details[0]?.min_beauty,
      min_happiness: chain.evolution_details[0]?.min_happiness,
      min_level: chain.evolution_details[0]?.min_level,
      needs_overworld_rain: chain.evolution_details[0]?.needs_overworld_rain,
      party_species: chain.evolution_details[0]?.party_species,
      party_type: chain.evolution_details[0]?.party_type,
      relative_physical_stats: chain.evolution_details[0]?.relative_physical_stats,
      time_of_day: chain.evolution_details[0]?.time_of_day,
      trade_species: chain.evolution_details[0]?.trade_species,
      trigger: chain.evolution_details[0]?.trigger?.name,
      turn_upside_down: chain.evolution_details[0]?.turn_upside_down,
    };
  
    result.push(currentPokemon);
  
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      for (let nextEvolution of chain.evolves_to) {
        this.traverseEvolutionChain(nextEvolution, result);
      }
    }
  }

  fetchAllMoves(learnedMoveList: any): Observable<Move[]> {
    let requests: Observable<Move>[] = learnedMoveList.map((move: Move) => this.requestMoveDetails(move.name));
    
    // When every movement is requested it returns the array
    return forkJoin(requests);
  }

  requestMoveDetails(name: string): Observable<Move> {
    return this.http.get(this.urlMove + name).pipe(
      switchMap((response: any) => {
        // let name:any;
        // if(localStorage.getItem('language') == 'en'){
        //   name = response.name
        // }else{
        //   name = response.names.find((name: any) => name.language.name === 'es').name;
        // }
        let move: Move = {
          moveId: response.id,
          name: response.name,
          power: response.power,
          accuracy: response.accuracy,
          type: response.type.name,
          damageClass: response.damage_class.name,
          machine: ""
        };

        if (response.machines.length > 0) {
          let machineUrl = response.machines.find((machine: any) => machine.version_group.name === 'platinum')?.machine.url;

          if (machineUrl) {
            return this.requestMachineName(machineUrl).pipe(
              map((mt: string) => {
                move.machine = mt;
                return move;
              })
            );
          }
        }

        return of(move); // if there's no machines it returns the move with the machine attribute empty
      })
    );
  }

  requestMachineName(machineUrl: string): Observable<string> {
    return this.http.get(machineUrl).pipe(
      map((response: any) => response.item.name)
    );
  }

  /**
   * Gets the background gradient which is going to be applied to the pokemon card
   * @param pokemon the pokemon to apply the background gradient
   * @returns the background gradient with it's types colors
   */
  getGradientBackground(pokemon: BasicPokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};
  
    if (pokemon.type1 && pokemon.type2) {
      let foundType1 = this.typesData.types.find((type: any) => type.name === pokemon.type1);
      let foundType2 = this.typesData.types.find((type: any) => type.name === pokemon.type2);
  
      if (foundType1 && foundType2) {
        backgroundStyle['background'] = `radial-gradient(${foundType2.color} 0%, ${foundType1.color} 100%)`;
      }
    } else if (pokemon.type1) {
      let foundType = this.typesData.types.find((type: any) => type.name === pokemon.type1);
      
      if (foundType) {
        backgroundStyle['background'] = `radial-gradient(${foundType.color} 0%, ${foundType.color} 40%,  rgba(146, 146, 146, 0.5) 100%)`;
      }
    }
  
    return backgroundStyle;
  }

  /**
   * Gets the background color which is going to be applied to the type box of the pokemon
   * @param pokemon the pokemon to apply the background color for it's types
   * @returns the background color for the type
   */
  getTypeColor(type: string): string {
    let foundType = this.typesData.types.find((t: any) => t.name === type);
    return foundType ? foundType.color : "rgba(146, 146, 146, 0.5)";
  }
}
