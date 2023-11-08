import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { PokemonListComponent } from './component/pokemon-list/pokemon-list.component';
import { IdFormatPipe } from './id-format.pipe';
import { HeaderComponent } from './component/header/header.component';
import { FootterComponent } from './component/footter/footter.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    IdFormatPipe,
    HeaderComponent,
    FootterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
