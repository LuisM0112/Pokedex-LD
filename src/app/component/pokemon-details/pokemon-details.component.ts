import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'src/app/model/pokemon';
import { PokemonService } from 'src/app/pokemon.service';
import * as jsonTypes from '../../../assets/data/typesData.json';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit{

  typesData: any = jsonTypes;

  pokemon: Pokemon = new Pokemon;

  weakList: string[] = [];
  veryWeakList: string[] = [];
  strongList: string[] = [];
  veryStrongList: string[] = [];
  notEffectiveList: string[] = [];
  neutralList: string[] = [];

  constructor(
    public pokemonService: PokemonService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params['id']; // Obtain pokemon id from the URL
    this.pokemonService.fetchPokemon(id).subscribe((pokemon: Pokemon) => {
      this.pokemon = pokemon;
      this.sortTypes(pokemon.type1, pokemon.type2);
    });
  }

  sortTypes(type1: string, type2: string){
    if (type1 && type2) {
      let a = this.typesData.types.find((t: any) => t.name === type1);
      let b = this.typesData.types.find((t: any) => t.name === type2);
      for (let pos of this.typesData.types) {
        if (a.effectiveness[pos.name] == 0 || b.effectiveness[pos.name] == 0){
          this.notEffectiveList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 2 && b.effectiveness[pos.name] == 2){
          this.veryWeakList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 2 && b.effectiveness[pos.name] == 0.5){
          this.neutralList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 0.5 && b.effectiveness[pos.name] == 2){
          this.neutralList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 2 || b.effectiveness[pos.name] == 2){
          this.weakList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 1 && b.effectiveness[pos.name] == 1){
          this.neutralList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 1 && b.effectiveness[pos.name] == 0.5){
          this.strongList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 0.5 && b.effectiveness[pos.name] == 1){
          this.strongList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 0.5 && b.effectiveness[pos.name] == 0.5){
          this.veryStrongList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 0.5 || b.effectiveness[pos.name] == 0.5){
          this.strongList.push(pos.name);
        }
      }
    } else {
      let a = this.typesData.types.find((t: any) => t.name === type1);
      for (let pos of this.typesData.types) {
        if (a.effectiveness[pos.name] == 2) {
          this.weakList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 1){
          this.neutralList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 0.5){
          this.strongList.push(pos.name);
        } else if (a.effectiveness[pos.name] == 0){
          this.notEffectiveList.push(pos.name);
        }
      }
    }
  }

}
