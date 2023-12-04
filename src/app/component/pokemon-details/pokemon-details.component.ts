import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/pokemon.service';
import { BasicPokemon } from 'src/app/model/basic-pokemon';
import { FullPokemon } from 'src/app/model/full-pokemon';
import { Subscription } from 'rxjs';
import * as jsonTypes from '../../../assets/data/typesData.json';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnDestroy{

  subscription: Subscription | null;

  typesData: any = jsonTypes;

  pokemon: FullPokemon = new FullPokemon;
  evolutions: BasicPokemon[] = [];
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
  ) {
    this.subscription = this.activatedRoute.params.subscribe((data: any) => this.loadData(data['id']));
  }

  ngOnDestroy(){
    this.subscription?.unsubscribe();
  }

  private loadData(id: any) {
    this.pokemonService.requestFullPokemon(id).subscribe((pokemon: FullPokemon) => {
      this.pokemon = pokemon;
      this.pokemonService.fetchEvolutions(this.pokemon.evolutionChain).subscribe(((evolutions: BasicPokemon[]) => this.evolutions = evolutions))
      this.sortTypes(pokemon.type1, pokemon.type2);
    });
  }

  getRequirements(index: number): string[]{
    let requirements: string[] = [];
    let evoDetails = this.pokemon.evolutionChain[index];
    if (evoDetails.evolutionDetails.length != 0) {
      let evo = evoDetails.evolutionDetails[0]
      if (evo.gender) {
        requirements.push(evo.gender = 1? '♂️' : '♀')
      }
      if (evo.held_item) {
        requirements.push(evo.held_item.name)
      }
      if (evo.item) {
        requirements.push(evo.item.name)
      }
      if (evo.known_move) {
        requirements.push(evo.known_move.name)
      }
      if (evo.known_move_type) {
        requirements.push(evo.known_move_type.name)
      }
      if (evo.location) {
        requirements.push('🗺️ '+evo.location.name)
      }
      if (evo.min_affection) {
        requirements.push('❤️ '+evo.min_affection)
      }
      if (evo.min_beauty) {
        requirements.push('🎀 '+evo.min_beauty)
      }
      if (evo.min_happiness) {
        requirements.push('☺️ '+evo.min_happiness)
      }
      if (evo.min_level) {
        requirements.push('⬆️ '+evo.min_level)
      }
      if (evo.needs_overworld_rain) {
        requirements.push('🌧')
      }
      if (evo.party_species) {
        requirements.push(''+evo.party_species)
      }
      if (evo.party_type) {
        requirements.push(''+evo.party_type)
      }
      if (evo.relative_physical_stats) {
        requirements.push('📊 '+evo.relative_physical_stats)
      }
      if (evo.time_of_day) {
        requirements.push('🕛 '+evo.time_of_day)
      }
      if (evo.trade_species) {
        requirements.push('🔃 '+evo.trade_species)
      }
      if (evo.trigger) {
        requirements.push('⚡ '+evo.trigger.name)
      }
      if (evo.turn_upside_down) {
        requirements.push('⤵ '+evo.turn_upside_down)
      }
    }
    return requirements;
  }

  sortTypes(type1: string, type2: string) {
    this.weakList = [];
    this.veryWeakList = [];
    this.strongList = [];
    this.veryStrongList = [];
    this.notEffectiveList = [];
    this.neutralList = [];

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

  getGradientBackground(pokemon: BasicPokemon): { [key: string]: string } {
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
        backgroundStyle['background'] = `radial-gradient(${foundType.color} 0%, ${foundType.color} 40%,  rgba(146, 146, 146, 0.5) 100%)`;
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
}
