import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as jsonTypeColors from '../../../assets/data/typeColors.json'
import * as jsonTypes from '../../../assets/data/types.json'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  types: string[] = [];
  typeColors: any = jsonTypeColors;
  typesData: any = jsonTypes;

  @Output()
  inputTextEvent = new EventEmitter();

  inputText = "";
  visibility = "collapse";

  ngOnInit(): void {
    this.types = this.fillTypes();
  }

  sendInputText(){
    this.inputTextEvent.emit({inputText: this.inputText.toLowerCase()});
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

  changeFilterPanelVisibility(){
    (this.visibility === "visible") ? this.visibility = "collapse" : this.visibility = "visible";
  }
  
  filterByGeneration(generation: number): void {
    // Puedes llamar a tu lógica de filtrado aquí
    // Por ejemplo, puedes emitir un evento con el número de generación seleccionado
    // y manejar ese evento en tu componente principal o donde sea necesario.
    // También puedes llamar a un método del servicio que realiza el filtrado.
    // Aquí te doy un ejemplo simple usando el EventEmitter:
    
    // Emitir un evento con el número de generación seleccionado
    this.inputTextEvent.emit({ inputText: '', generation: generation });
  }

}
