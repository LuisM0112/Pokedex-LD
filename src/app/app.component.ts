import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  filter = '';

  constructor(){}

  updateFilter(event: any){
    this.filter = event.filter;
  }
}
