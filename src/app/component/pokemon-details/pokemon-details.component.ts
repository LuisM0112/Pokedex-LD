import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/pokemon.service';
import { BasicPokemon } from 'src/app/model/basic-pokemon';
import { FullPokemon } from 'src/app/model/full-pokemon';
import { Subscription } from 'rxjs';
import { Move } from 'src/app/model/move';
import { GenType } from 'src/app/interface/gen-type';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnDestroy{

  subscription: Subscription | null;

  pokemon: FullPokemon = new FullPokemon;
  evolutions: BasicPokemon[] = [];
  lvlMoves: Move[] = [];
  machineMoves: Move[] = [];

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
    this.subscription = this.activatedRoute.params.subscribe((data: any) => this.loadData(data['pokemonId']));
  }

  ngOnDestroy(){
    this.subscription?.unsubscribe();
  }

  private loadData(pokemonId: string) {
    this.pokemonService.requestFullPokemon(pokemonId).subscribe((pokemon: FullPokemon) => {
      this.pokemon = pokemon;
      this.pokemonService.fetchEvolutions(this.pokemon.evolutionChain).subscribe(((evolutions: BasicPokemon[]) => this.evolutions = evolutions));
      this.sortTypes(pokemon.type1, pokemon.type2);
      this.pokemonService.fetchAllMoves(this.pokemon.learnedMoves).subscribe((moves: Move[]) => {
        console.log(moves);
        this.machineMoves = moves.filter((move) => this.getMoveLearnMethod(move) === 'machine').sort((a,b) => {
          if (a.machine > b.machine) return 1;
          if (a.machine < b.machine) return -1;
          return 0;
        });
        this.lvlMoves = moves.filter((move) => this.getMoveLearnMethod(move) === 'level-up').sort((a,b) => this.getMoveLearnLvl(a) - this.getMoveLearnLvl(b));
      });
    });
  }

  getMoveLearnLvl(move: Move): number {
    let result = this.pokemon.learnedMoves.find(learned => learned.name === move.name);
    return result ? result.learnLevel : 0;
  }

  getMoveLearnMethod(move: Move): string {
    let result = this.pokemon.learnedMoves.find(learned => learned.name === move.name);
    return result ? result.learnMethod : '';
  }  

  getRequirements(index: number): string[]{
    let requirements: string[] = [];
    let evo = this.pokemon.evolutionChain[index];
    if (evo) {
      if (evo.gender) requirements.push(evo.gender = 1? '♂️' : '♀')
      if (evo.held_item) requirements.push(evo.held_item)
      if (evo.item) requirements.push(evo.item)
      if (evo.known_move) requirements.push(evo.known_move)
      if (evo.known_move_type) requirements.push(evo.known_move_type)
      if (evo.location) requirements.push(`🗺️ ${evo.location}`)
      if (evo.min_affection) requirements.push(`❤️ ${evo.min_affection}`)
      if (evo.min_beauty) requirements.push(`🎀 ${evo.min_beauty}`)
      if (evo.min_happiness) requirements.push(`☺️ ${evo.min_happiness}`)
      if (evo.min_level) requirements.push(`⬆️ ${evo.min_level}`)
      if (evo.needs_overworld_rain) requirements.push('🌧')
      if (evo.party_species) requirements.push(''+evo.party_species)
      if (evo.party_type) requirements.push(''+evo.party_type)
      if (evo.relative_physical_stats) requirements.push(`📊 ${evo.relative_physical_stats}`)
      if (evo.time_of_day) requirements.push(`🕛 ${evo.time_of_day}`)
      if (evo.trade_species) requirements.push(`🔃 ${evo.trade_species}`)
      if (evo.trigger) requirements.push(`⚡ ${evo.trigger}`)
      if (evo.turn_upside_down) requirements.push(`⤵ ${evo.turn_upside_down}`)
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

    let getType = (typeName: string) => this.pokemonService.typesData.types.find((t: GenType) => t.name === typeName);
    let typeA = getType(type1);
    let typeB = type2 ? getType(type2) : null;

    for (let pos of this.pokemonService.typesData.types) {
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
    return `${(value / 255) * 100}%`;
  }

  toggleSprite(): void {
    this.isNormalSprite = !this.isNormalSprite;
  }
}
