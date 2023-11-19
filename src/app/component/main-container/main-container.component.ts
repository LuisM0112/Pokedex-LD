import { Component } from '@angular/core';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent {
  filterText: string = '';
  filterTypes: string[] = [];
  filterGens: number[] = [];

  constructor(){}

  updateFilterText(event: any){
    this.filterText = event.filter;
  }
  updateFilterTypes(event: any){
    this.filterTypes = event.filter;
  }
  updateFilterGens(event: any){
    this.filterGens = event.filter;
  }
}
