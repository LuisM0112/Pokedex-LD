import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PokemonService } from 'src/app/pokemon.service';
import { Filter } from 'src/app/model/filter';
import { GenType } from 'src/app/interface/gen-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  typesFilter: Filter[] = [];
  gensFilter: Filter[] = [];

  types: GenType[] = [];
  gens: GenType[] = [];

  @Output()
  filterTextEvent = new EventEmitter();

  @Output()
  filterTypesEvent = new EventEmitter();

  @Output()
  filterGensEvent = new EventEmitter();

  inputText = "";

  visibility = "collapse";

  constructor(public pokemonService: PokemonService) {
    this.types = this.pokemonService.typesData.types.map((type: GenType) => ({
      name: type.name,
      color: type.color,
    }));

    this.gens = this.pokemonService.gensData.generations.map((gen: GenType) => ({
      name: gen.name,
      color: gen.color,
    }));

    this.typesFilter = this.fillTypesFilters();
    this.gensFilter = this.fillGensFilters();

    // Comprueba si el modo oscuro está activado al iniciar
    const isDarkMode = localStorage.getItem('darkMode');
    if (isDarkMode && JSON.parse(isDarkMode)) {
      const body = document.querySelector('body');
      body?.classList.add('dark-mode');
    }
  }
  ngOnInit(): void {
    console.log("recargar")
  }

  sendInputText() {
    this.filterTextEvent.emit({ filter: this.inputText.toLowerCase() });
  }

  sendInputTypes() {
    this.filterTypesEvent.emit({ filter: this.getSelectedTypes() });
  }

  sendInputGens() {
    this.filterGensEvent.emit({ filter: this.getSelectedGens() });
  }

  fillTypesFilters(): Filter[] {
    return this.types.map((type, index) => new Filter(index + 1, type.name, false));
  }

  fillGensFilters(): Filter[] {
    return this.gens.map((gen, index) => new Filter(index + 1, gen.name, false));
  }

  changePanelVisibility() {
    this.visibility = (this.visibility === "visible") ? "collapse" : "visible";
  }

  changeFilterTypesStatus(index: number): void {
    this.typesFilter[index].active = !this.typesFilter[index].active;
  }

  changeFilterGensStatus(index: number): void {
    this.gensFilter[index].active = !this.gensFilter[index].active;
  }

  getTypeStatus(index: number): string {
    return this.typesFilter[index].active ? 'active' : '';
  }

  getGenStatus(index: number): string {
    return this.gensFilter[index].active ? 'active' : '';
  }

  getSelectedTypes(): string[] {
    return this.typesFilter.filter(type => type.active).map(type => type.name);
  }

  getSelectedGens(): number[] {
    return this.gensFilter.filter(gen => gen.active).map(gen => gen.filterId);
  }

  toggleDarkMode() {
    const body = document.querySelector('body');
    body?.classList.toggle('dark-mode');

    // Verifica si el modo oscuro está activado
    const isDarkMode = body?.classList.contains('dark-mode');

    // Guarda el estado en el Local Storage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }

  changeLan() {
    if (localStorage.getItem('language') == 'en') {
      localStorage.setItem('language', 'es')
    } else {
      localStorage.setItem('language', 'en')
    }
    window.location.reload()
  }
}

