import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
