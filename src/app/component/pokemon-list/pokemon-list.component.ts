import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '../../model/pokemon';
import { PokemonService } from '../../pokemon.service';
// import * as jsonData from '../../../assets/data/typeColors.json'

import * as jsonTypes from '../../../assets/data/typesData.json'; // Importa los datos de typesData.json

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

  // typeColors: any = jsonData; // Has the data of the corresponding color for each type

  typeData: any = jsonTypes; // Utiliza typesData.json

  @Input()
  filterText: string = '';  // Gets the filter that is going to be applied to the pokemon array form the search bar
  @Input()
  filterTypes: string[] = [];  // Gets the filter that is going to be applied to the pokemon array form the search bar
  @Input()
  filterGens: number[] = [];  // Gets the filter that is going to be applied to the pokemon array form the search bar

  constructor(public pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.fetchAllPokemon().subscribe(((pokemones: Pokemon[]) => this.pokemones = pokemones));
  }

  getPokemonesFiltered(): Pokemon[] {
    let result: Pokemon[] = this.pokemones;

    if (this.filterGens.length > 0) result = result.filter((pokemon) => this.filterGens.includes(pokemon.generation));

    if (this.filterTypes.length > 0) result = result.filter((pokemon) => this.filterTypes.includes(pokemon.type1) || this.filterTypes.includes(pokemon.type2));

    if (this.filterText) result = result.filter((pokemon) => pokemon.name.includes(this.filterText) || pokemon.id.toString().includes(this.filterText));

    return result;
  }

  getPokemon(id: number): Pokemon {
    return <Pokemon>{ ...this.pokemones.find(t => t.id == id) };
  }

  /**
   * Gets the background gradient which is going to be applied to the pokemon card
   * @param pokemon 
   * @returns 
   */
  // getGradientBackground(pokemon: Pokemon): { [key: string]: string } {
  //   let backgroundStyle: { [key: string]: string } = {};

  //   if (pokemon.type1 && pokemon.type2) {
  //     backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type2]} 0%, ${this.typeColors[pokemon.type1]} 100%)`;
  //   } else backgroundStyle['background'] = `radial-gradient(${this.typeColors[pokemon.type1]} 0%, ${this.typeColors[pokemon.type1]} 40%,  ${this.typeColors.null} 100%)`;

  //   return backgroundStyle;
  // }

  getGradientBackground(pokemon: Pokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};

    if (pokemon.type1 && pokemon.type2) {
      backgroundStyle['background'] = `radial-gradient(${this.typeData.types.find((type: any) => type.name === pokemon.type2).color} 0%, ${this.typeData.types.find((type: any) => type.name === pokemon.type1).color} 100%)`;
    } else {
      backgroundStyle['background'] = `radial-gradient(${this.typeData.types.find((type: any) => type.name === pokemon.type1).color} 0%, ${this.typeData.types.find((type: any) => type.name === pokemon.type1).color} 40%,  ${this.typeData.types.find((type: any) => type.name === 'null').color} 100%)`;
    }

    return backgroundStyle;
  }

  getTypeColor(type: string): string {
    let foundType = this.typeData.types.find((t: any) => t.name === type);
    return foundType ? foundType.color : this.typeData.types.find((t: any) => t.name === 'null').color;
  }
}
