import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../model/pokemon';
import { PokemonService } from '../pokemon.service';
import * as jsonData from '../../assets/data/typeColors.json';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemones: Pokemon[] = [];
  typeColors: any = jsonData;

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

  getGradientBackground(pokemon: Pokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};
    
    if (pokemon.type1 && pokemon.type2) {
      backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type2]} 0%, ${this.typeColors[pokemon.type1]} 100%)`;
    } else backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type1]} 0%, ${this.typeColors[pokemon.type1]} 40%, ${this.typeColors["null"]} 100%)`;

    return backgroundStyle;
  }
}
