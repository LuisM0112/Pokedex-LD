import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Pokemon } from './model/pokemon';
@Injectable({
  providedIn: 'root'
})
export class PokemonService implements OnInit {
  pokemones: Pokemon[] = [];

  constructor(private http: HttpClient) {}
  
  getPokemones(): Pokemon[] {
    return this.pokemones;
  }

  getPokemon(id: number): Pokemon {
    return <Pokemon>{ ...this.pokemones.find(t => t.id == id) };
  }

  requestPokemon(id: number): Observable<string> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/'+id)
    .pipe(map((request: any) => request.name));
  }
  
  ngOnInit(): void {
      
  }
}