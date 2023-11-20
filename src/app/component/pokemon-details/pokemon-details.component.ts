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
      this.compareTypes();
    });
  }

  getPokemon(): Pokemon {
    return this.pokemon;
  }

  getTypes() {
    return this.typesData.types.map((type: any) => ({
      name: type.name,
      color: type.color
    }));
  }

  getTypeData(typeName: string): any {
    return this.typesData.types.find(
      (type: any) => type.name === typeName.toLowerCase()
    );
  }

  getCombinedEffectiveness(effectiveness1: number, effectiveness2: number): number {
    if (effectiveness1 === 0 && effectiveness2 === 0) {
      return 0; // Not Effective
    } else if (effectiveness1 === 2 && effectiveness2 === 2) {
      return 4; // Very Strong
    } else if (effectiveness1 === 0.5 || effectiveness2 === 0.5) {
      return 2; // Strong
    } else if (effectiveness1 === 2 || effectiveness2 === 2) {
      return 0.5; // Weak
    } else if (effectiveness1 === 0.25 || effectiveness2 === 0.25) {
      return 0.25; // Very Weak
    } else {
      return 1; // Neutral
    }
  }
  
  compareTypes() {
    let type1Data = this.getTypeData(this.pokemon.type1);
    let type2Data = this.pokemon.type2 ? this.getTypeData(this.pokemon.type2) : null;
  
    if (type1Data) {
      for (let [type, effectiveness1] of Object.entries<any>(type1Data.effectiveness)) {
        let effectiveness2 = type2Data ? type2Data.effectiveness[type] : 1; // Neutral if no second type
  
        let combinedEffectiveness = effectiveness1 * effectiveness2;
  
        switch (combinedEffectiveness) {
          case 4:
            this.veryStrongList.push(type);
            break;
          case 2:
            this.strongList.push(type);
            break;
          case 1:
            this.neutralList.push(type);
            break;
          case 0.5:
            this.weakList.push(type);
            break;
          case 0.25:
            this.veryWeakList.push(type);
            break;
          case 0:
            this.notEffectiveList.push(type);
            break;
          default:
            break;
        }
      }
    }
  }
  
}
