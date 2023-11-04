import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../model/pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit{
  pokemones: Pokemon[] = [];
  types = document.querySelectorAll('.type');

  constructor(public pokemonService: PokemonService) {
    
  }
  
  ngOnInit() {
    this.pokemonService.fetchAllPokemon().subscribe(((pokemones: Pokemon[]) => this.pokemones = pokemones));
    // this.setTypesColors();
  }

  getPokemones(): Pokemon[] {
    return this.pokemones;
  }

  setPokemones(pokemones: Pokemon[]){
    this.pokemones = pokemones;
  }

  getPokemon(id: number): Pokemon {
    return <Pokemon>{ ...this.pokemones.find(t => t.id == id) };
  }

  // setTypesColors(){
  //   for (let i = 1; i <= 493; i++) {
  //     let text = this.getPokemon(i).type1;
  //     const type = document.querySelectorAll('*:contains(Normal)');
  //     switch (text) {
  //       case "normal":
  //         type.classList.add('normal');
  //         break;
      
  //       case "Fire":
  //         type.classList.add('fire');
  //         break;
      
  //       case "Water":
  //         type.classList.add('water');
  //         break;
      
  //       default:
  //         break;
  //     };
  //   }
  // }
}
