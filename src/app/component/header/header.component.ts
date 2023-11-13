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

  filters: Filter[] = [];

  types: string[] = [];
  gens: string[] = ['gen 1', 'gen 2', 'gen 3', 'gen 4', 'gen 5', 'gen 6', 'gen 7', 'gen 8'];

  @Output()
  filterEvent = new EventEmitter();

  inputText = "";
  inputFiltros: string[] = [];
  visibility = "collapse";

  ngOnInit(): void {
    this.types = this.fillTypes();
    this.filters = this.fillFilters();
    for (let i = 0; i < 26; i++) {
      console.log(this.filters[i].name);
    }
  }

  sendInputText(){
    this.filterEvent.emit({filter: this.inputText.toLowerCase()});
  }

  fillFilters(): Filter[]{
    let filters: Filter[] = [];
    for (let i = 0; i < 18; i++) {
      filters.push(new Filter(i ,'type', this.types[i].toString(), false))
    }
    for (let i = 0; i < 8; i++) {
      filters.push(new Filter(i, 'gen', this.gens[i], false))
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
  
  changeButtonStatus(index: number): void{
    this.filters[index].active = !this.filters[index].active;
  }

  test(i: number){
    console.log(i);
  }
  
  filterByGeneration(generation: number): void {
    // Puedes llamar a tu lógica de filtrado aquí
    // Por ejemplo, puedes emitir un evento con el número de generación seleccionado
    // y manejar ese evento en tu componente principal o donde sea necesario.
    // También puedes llamar a un método del servicio que realiza el filtrado.
    // Aquí te doy un ejemplo simple usando el EventEmitter:
    
    // Emitir un evento con el número de generación seleccionado
    // this.inputTextEvent.emit({ inputText: '', generation: generation });
    // this.inputGen.push
  }

}
