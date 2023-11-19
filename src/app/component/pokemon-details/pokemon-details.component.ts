import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'src/app/model/pokemon';
import { PokemonService } from 'src/app/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit{

  pokemon: Pokemon = new Pokemon;

  constructor(
    public pokemonService: PokemonService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params['id']; // Obtain pokemon id from the URL
    this.pokemonService.fetchPokemon(id).subscribe((pokemon: Pokemon) => {this.pokemon = pokemon;});
  }

  getPokemon(): Pokemon {
    return this.pokemon;
  }
}
