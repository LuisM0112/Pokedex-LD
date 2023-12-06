import { Component, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { BasicPokemon } from 'src/app/model/basic-pokemon';

/**
 * This Pokemon-list class is going to take the array of pokemon to be displayed
 * by the HTML component, and it sets the background style for the pokemon element
 */
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  pokemones: BasicPokemon[] = [];  // Will contain the array of every pokemon

  @Input()
  filterText: string = '';    // Gets the name or id to filter the array
  @Input()
  filterTypes: string[] = []; // Gets the types selected to filter the array
  @Input()
  filterGens: number[] = [];  // Gets the generations selected to filter the array

  constructor(public pokemonService: PokemonService) {}

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

}
