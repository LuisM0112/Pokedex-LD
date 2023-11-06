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

  typeColors: { [key: string]: string } = {
    default: 'var(--default)',
    normal: 'var(--normal)',
    fire: 'var(--fire)',
    water: 'var(--water)',
    grass: 'var(--grass)',
    electric: 'var(--electric)',
    ice: 'var(--ice)',
    fighting: 'var(--fighting)',
    poison: 'var(--poison)',
    ground: 'var(--ground)',
    flying: 'var(--flying)',
    psychic: 'var(--psychic)',
    bug: 'var(--bug)',
    rock: 'var(--rock)',
    ghost: 'var(--ghost)',
    dragon: 'var(--dragon)',
    dark: 'var(--dark)',
    steel: 'var(--steel)',
    fairy: 'var(--fairy)',
  };

  getGradientBackground(pokemon: Pokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};
    
    if (pokemon.type1 && pokemon.type2) {
      backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type2]} 0%, ${this.typeColors[pokemon.type1]} 100%)`;
    } else backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type1]} 0%, ${this.typeColors[pokemon.type1]} 40%,  ${this.typeColors['default']} 100%)`;

    return backgroundStyle;
  }
}
