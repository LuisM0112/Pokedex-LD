import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { Pokemon } from './model/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) {}

  fetchAllPokemon(): Observable<Pokemon[]> {
    let requests: Observable<Pokemon>[] = [];
    for (let i = 1; i <= 999; i++) {
      let request = this.requestPokemon(i);
      requests.push(request);
    }

    return forkJoin(requests).pipe(map((pokemones: Pokemon[]) => pokemones));
  }

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

