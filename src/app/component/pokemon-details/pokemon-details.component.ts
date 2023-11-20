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
  isNormalSprite: boolean = true;
  visibility = "collapse";

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

  sortTypes(type1: string, type2: string) {
    let getType = (typeName: string) => this.typesData.types.find((t: any) => t.name === typeName);
    let typeA = getType(type1);
    let typeB = type2 ? getType(type2) : null;

    for (let pos of this.typesData.types) {
      let effectiveness = typeA.effectiveness[pos.name];
      let otherEffectiveness = typeB ? typeB.effectiveness[pos.name] : null;

      if (effectiveness === 0 || (otherEffectiveness !== null && otherEffectiveness === 0)) {
        this.notEffectiveList.push(pos.name);
      } else if (effectiveness === 2 && otherEffectiveness === 2) {
        this.veryWeakList.push(pos.name);
      } else if ((effectiveness === 2 && otherEffectiveness === 0.5) || (effectiveness === 0.5 && otherEffectiveness === 2)) {
        this.neutralList.push(pos.name);
      } else if (effectiveness === 2 || otherEffectiveness === 2) {
        this.weakList.push(pos.name);
      } else if (effectiveness === 1 && otherEffectiveness === 1) {
        this.neutralList.push(pos.name);
      } else if ((effectiveness === 1 && otherEffectiveness === 0.5) || (effectiveness === 0.5 && otherEffectiveness === 1)) {
        this.strongList.push(pos.name);
      } else if (effectiveness === 0.5 && otherEffectiveness === 0.5) {
        this.veryStrongList.push(pos.name);
      } else if (effectiveness === 0.5 || otherEffectiveness === 0.5) {
        this.strongList.push(pos.name);
      }
    }
  }

  getPercentage(value: number): string {
    let maxStatValue = 255; // Valor máximo de las estadísticas
    let percentage = (value / maxStatValue) * 100; // Calcula el porcentaje
    return `${percentage}%`; // Retorna el porcentaje como string para utilizarlo en el estilo

  }

  toggleSprite(): void {
    this.isNormalSprite = !this.isNormalSprite;
  }

  getGradientBackground(pokemon: Pokemon): { [key: string]: string } {
    let backgroundStyle: { [key: string]: string } = {};
  
    if (pokemon.type1 && pokemon.type2) {
      let foundType1 = this.typesData.types.find((type: any) => type.name === pokemon.type1);
      let foundType2 = this.typesData.types.find((type: any) => type.name === pokemon.type2);
  
      if (foundType1 && foundType2) {
        backgroundStyle['background'] = `radial-gradient(${foundType2.color} 0%, ${foundType1.color} 100%)`;
      }
    } else if (pokemon.type1) {
      let foundType = this.typesData.types.find((type: any) => type.name === pokemon.type1);
      
      if (foundType) {
        backgroundStyle['background'] = `radial-gradient(${foundType.color} 0%, ${foundType.color} 40%,  ${this.typesData.types.find((type: any) => type.name === 'null').color} 100%)`;
      }
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

  changePanelVisibility(){
    (this.visibility === "visible") ? this.visibility = "collapse" : this.visibility = "visible";
  }
}
