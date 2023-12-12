import { Component, Input, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/pokemon.service';
import { BasicPokemon } from 'src/app/model/basic-pokemon';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  pokemones: BasicPokemon[] = [];
  
  @Input()
  filterText: string = '';
  @Input()
  filterTypes: string[] = [];
  @Input()
  filterGens: number[] = [];

  constructor(public pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.fetchAllPokemon().subscribe(((pokemones: BasicPokemon[]) => this.pokemones = pokemones));
  }

  getPokemonesFiltered(): BasicPokemon[] {
    let result: BasicPokemon[] = this.pokemones;
  
    if (this.filterText === 'tercero del mundo') {
      const specificPokemonIds = [65, 143, 121, 145, 144, 112];
      result = result.filter((pokemon) => specificPokemonIds.includes(pokemon.pokemonId));
    } else {
      if (this.filterGens.length) {
        result = result.filter((pokemon) => this.filterGens.includes(pokemon.generation));
      }
  
      if (this.filterTypes.length) {
        result = result.filter((pokemon) => this.filterTypes.includes(pokemon.type1) || this.filterTypes.includes(pokemon.type2));
      }
  
      if (this.filterText) {
        result = result.filter((pokemon) => pokemon.name.includes(this.filterText) || pokemon.pokemonId.toString().includes(this.filterText));
      }
    }
  
    return result;
  }

  getPokemonWidthClass(): string {
    const filteredPokemonCount = this.getPokemonesFiltered().length;
  
    if (filteredPokemonCount === 1) {
      return 'one-pokemon-width'; //  un Pokémon
    } else if (filteredPokemonCount === 2) {
      return 'two-pokemon-width'; // dos Pokémon
    } else {
      return 'default-pokemon-width'; // defecto
    }
  }

  isDarkMode: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef;

  playSound(pokemonId: number) {
    const audioPlayer = this.audioPlayerRef.nativeElement as HTMLAudioElement;

    switch (pokemonId) {
      case 67:
        audioPlayer.src = 'assets/sound/siuu.mp3';
        audioPlayer.play();
        break;
      case 143:
        audioPlayer.src = 'assets/sound/knekro.mp3';
        audioPlayer.play();
        break;
      case 39:
        audioPlayer.src = 'assets/sound/away.mp3';
        audioPlayer.play();
        break;
      case 149:
        audioPlayer.src = 'assets/sound/esp.mp3';
        audioPlayer.play();
        break;
      case 50:
        audioPlayer.src = 'assets/sound/mondongo.mp3';
        audioPlayer.play();
        break;
      case 493:
        audioPlayer.src = 'assets/sound/illo.mp3';
        audioPlayer.play();
        break;        // Agregar
      default:
        // Sonido por defecto 
        break;
    }
  }

  stopSound() {
    const audioPlayer = this.audioPlayerRef.nativeElement as HTMLAudioElement;
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
}

