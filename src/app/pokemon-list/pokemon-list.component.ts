import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../model/pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemones: Pokemon[] = [];

  constructor(public pokemonService: PokemonService) {}
  
  ngOnInit() {
    this.pokemonService.fetchAllPokemon().subscribe(((pokemones: Pokemon[]) => this.pokemones = pokemones));
  }

  getPokemones(): Pokemon[] {
    return this.pokemones;
  }

  getPokemon(id: number): Pokemon {
    return <Pokemon>{ ...this.pokemones.find(t => t.id == id) };
  }
}
