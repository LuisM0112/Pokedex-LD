import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '../../model/pokemon';
import { PokemonService } from '../../pokemon.service';
import * as jsonData from '../../../assets/data/typeColors.json'

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})

/**
 * This Pokemon-list class is going to take the array of pokemon to be displayed
 * by the HTML component, and it sets the background style for the pokemon element
 */
export class PokemonListComponent implements OnInit {

  pokemones: Pokemon[] = [];  // Will contain the array of every pokemon
  typeColors: any = jsonData; // Has the data of the corresponding color for each type

  @Input()
  filter: any;  // Gets the filter that is going to be applied to the pokemon array form the search bar

  constructor(public pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.fetchAllPokemon().subscribe(((pokemones: Pokemon[]) => this.pokemones = pokemones));
  }

  getPokemones(): Pokemon[] {
    return this.pokemones;
  }

  getPokemonesFiltered(): Pokemon[] {
    return this.getPokemones().filter((Pokemon)=> Pokemon.name.includes(this.filter) || Pokemon.id.toString().includes(this.filter));
  }

  getPokemon(id: number): Pokemon {
    return <Pokemon>{ ...this.pokemones.find(t => t.id == id) };
  }

  /**
   * Gets the background gradient which is going to be applied to the pokemon card
   * @param pokemon 
   * @returns 
   */
  getGradientBackground(pokemon: Pokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};

    if (pokemon.type1 && pokemon.type2) {
      backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type2]} 0%, ${this.typeColors[pokemon.type1]} 100%)`;
    } else backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type1]} 0%, ${this.typeColors[pokemon.type1]} 40%,  ${this.typeColors.null} 100%)`;

    return backgroundStyle;
  }
}
