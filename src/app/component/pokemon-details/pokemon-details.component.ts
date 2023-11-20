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
    this.pokemonService.fetchPokemon(id).subscribe((pokemon: Pokemon) => {this.pokemon = pokemon;});
  }


}
