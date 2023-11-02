import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { Pokemon } from './model/pokemon';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  pokemones: Pokemon[] = [];

  constructor(private http: HttpClient) {
    // for (let i= 0; i < 493; i++){
    //   this.pokemon = this.requestPokemon(i+1).subscribe(
    //     (newPokemon) => {
    //       this.addPokemon(newPokemon);
    //     },
    //     (error) => {
    //       console.error('Error al obtener Pokémon:', error);
    //     }
    //   );
    //   this.addPokemon(new Pokemon());
    // }
    this.fetchAllPokemon();
  }
  
  getPokemones(): Pokemon[] {
    return this.pokemones;
  }

  getPokemon(id: number): Pokemon {
    return <Pokemon>{ ...this.pokemones.find(t => t.id == id) };
  }

  fetchAllPokemon() {
    const requests: Observable<Pokemon>[] = [];
    for (let i = 1; i <= 493; i++) {
      const request = this.requestPokemon(i);
      requests.push(request);
    }

    forkJoin(requests).subscribe(
      (pokemones: Pokemon[]) => {
        this.pokemones = pokemones;
      },
      (error) => {
        console.error('Error fetching Pokemon:', error);
      }
    );
  }

  requestPokemon(id: number): Observable<Pokemon> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/&{id}').pipe(
      map((response: any) => {
        const pokemon = new Pokemon();
        pokemon.id = response.id;
        pokemon.name = response.name;
        pokemon.description = response.description;
        pokemon.type1 = response.type1;
        pokemon.type2 = response.type2;
        pokemon.weight = response.weight;
        return pokemon;
      })
    );
  }

  // addPokemon(pokemon: Pokemon){
  //   this.pokemones.push(pokemon);
  // }

}