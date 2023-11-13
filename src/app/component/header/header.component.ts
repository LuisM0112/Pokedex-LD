import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as jsonTypeColors from '../../../assets/data/typeColors.json'
import * as jsonTypes from '../../../assets/data/types.json'
import { Filter } from 'src/app/model/filter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  typeColors: any = jsonTypeColors;
  typesData: any = jsonTypes;

  typesFilter: Filter[] = [];
  gensFilter: Filter[] = [];

  types: string[] = [];
  gens: string[] = ['gen 1', 'gen 2', 'gen 3', 'gen 4', 'gen 5', 'gen 6', 'gen 7', 'gen 8'];

  @Output()
  filterTextEvent = new EventEmitter();

  @Output()
  filterTypesEvent = new EventEmitter();

  @Output()
  filterGensEvent = new EventEmitter();

  inputText = "";
  
  visibility = "collapse";

  ngOnInit(): void {
    this.types = this.fillTypes();
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
    for (let i = 0; i < 18; i++) {
      filters.push(new Filter(i, this.types[i].toString(), false))
    }
    return filters;
  }
  fillGensFilters(): Filter[]{
    let filters: Filter[] = [];
    for (let i = 0; i < 18; i++) {
      filters.push(new Filter(i+1, this.gens[i], false))
    }
    return filters;
  }

  fillTypes(): string[]{
    let types: string[] = [];
    for (let i = 1; i <= 18; i++) {
      types.push(this.typesData["type-"+i]);
    }
    return types;
  }

  getTypes(): string[]{
    return this.types;
  }
  getGens(): string[]{
    return this.gens;
  }

  changeFilterPanelVisibility(){
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
