import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  filterReceived = '';

  constructor(){}

  updateFilterReceived(event: any){
    this.filterReceived = event.filter;
  }
}
