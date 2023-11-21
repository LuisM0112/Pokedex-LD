import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { Pokemon } from '../../model/pokemon';

import * as jsonTypes from '../../../assets/data/typesData.json';
import { BasicPokemon } from 'src/app/interface/basic-pokemon';

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

  pokemones: BasicPokemon[] = [];  // Will contain the array of every pokemon

  typesData: any = jsonTypes; // Contains the data for each type

  @Input()
  filterText: string = '';    // Gets the name or id to filter the array
  @Input()
  filterTypes: string[] = []; // Gets the types selected to filter the array
  @Input()
  filterGens: number[] = [];  // Gets the generations selected to filter the array

  constructor(
    public pokemonService: PokemonService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.pokemonService.fetchAllPokemon().subscribe(((pokemones: BasicPokemon[]) => this.pokemones = pokemones));
  }

  getPokemonesFiltered(): BasicPokemon[] {
    let result: BasicPokemon[] = this.pokemones;

    if (this.filterGens.length > 0) result = result.filter((pokemon) => this.filterGens.includes(pokemon.generation));

    if (this.filterTypes.length > 0) result = result.filter((pokemon) => this.filterTypes.includes(pokemon.type1) || this.filterTypes.includes(pokemon.type2));

    if (this.filterText) result = result.filter((pokemon) => pokemon.name.includes(this.filterText) || pokemon.id.toString().includes(this.filterText));

    return result;
  }

  /**
   * Gets the background gradient which is going to be applied to the pokemon card
   * @param pokemon the pokemon to apply the background gradient
   * @returns the background gradient with it's types colors
   */
  getGradientBackground(pokemon: BasicPokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};

    if (pokemon.type1 && pokemon.type2) {
      backgroundStyle['background'] = `radial-gradient(${this.typesData.types.find((type: any) => type.name === pokemon.type2).color} 0%, ${this.typesData.types.find((type: any) => type.name === pokemon.type1).color} 100%)`;
    } else {
      backgroundStyle['background'] = `radial-gradient(${this.typesData.types.find((type: any) => type.name === pokemon.type1).color} 0%, ${this.typesData.types.find((type: any) => type.name === pokemon.type1).color} 40%, rgba(146, 146, 146, 0.5) 100%)`;
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
