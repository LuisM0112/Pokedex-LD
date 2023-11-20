import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Filter } from 'src/app/model/filter';

import * as jsonGens from '../../../assets/data/generationsData.json'
import * as jsonTypes from '../../../assets/data/typesData.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  typesData: any = jsonTypes;
  gensData: any = jsonGens;

  typesFilter: Filter[] = [];
  gensFilter: Filter[] = [];

  types = this.getTypes();
  gens = this.getGens();

  @Output()
  filterTextEvent = new EventEmitter();

  @Output()
  filterTypesEvent = new EventEmitter();

  @Output()
  filterGensEvent = new EventEmitter();

  inputText = "";

  visibility = "collapse";

  ngOnInit(): void {
    this.typesFilter = this.fillTypesFilters();
    this.gensFilter = this.fillGensFilters();
  }

  sendInputText(){
    this.filterTextEvent.emit({filter: this.inputText.toLowerCase()});
  }
  sendInputTypes(){
    this.filterTypesEvent.emit({filter: this.getSelectedTypes()});
  }
  sendInputGens(){
    this.filterGensEvent.emit({filter: this.getSelectedGens()});
  }

  fillTypesFilters(): Filter[]{
    let filters: Filter[] = [];
    for (let i = 0; i < this.types.length; i++) {
      filters.push(new Filter(i, this.types[i].name, false));
    }
    return filters;
  }

  fillGensFilters(): Filter[]{
    let filters: Filter[] = [];  
    for (let i = 0; i < this.gens.length; i++) {
      filters.push(new Filter(i + 1, this.gens[i].name, false));
    }
  
    return filters;
  }

  getTypes() {
    return this.typesData.types.map((type: any) => ({
      name: type.name,
      color: type.color
    }));
  }

  getGens() {
    return this.gensData.generations.map((gen: any) => ({
      name: gen.name,
      colors: gen.colors,
    }));
  }

  changePanelVisibility(){
    (this.visibility === "visible") ? this.visibility = "collapse" : this.visibility = "visible";
  }

  changeFilterTypesStatus(index: number): void{
    this.typesFilter[index].active = !this.typesFilter[index].active;
  }
  changeFilterGensStatus(index: number): void{
    this.gensFilter[index].active = !this.gensFilter[index].active;
  }

  getTypeStatus(index: number): string{
    return this.typesFilter[index].active ? 'active' : '';
  }
  getGenStatus(index: number): string{
    return this.gensFilter[index].active ? 'active' : '';
  }

  getSelectedTypes(): string[]{
    let selectedTypes: string[] = [];
    for (let i = 0; i < 18; i++) {
      if (this.typesFilter[i].active) selectedTypes.push(this.typesFilter[i].name);
    }
    return selectedTypes;
  }
  getSelectedGens(): number[]{
    let selectedTypes: number[] = [];
    for (let i = 0; i < 8; i++) {
      if (this.gensFilter[i].active) selectedTypes.push(this.gensFilter[i].id);
    }
    return selectedTypes;
  }
}
