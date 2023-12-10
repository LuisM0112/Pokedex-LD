import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { PokemonListComponent } from './component/pokemon-list/pokemon-list.component';
import { PokemonIdFormatPipe } from './pokemon-id-format.pipe';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { PokemonDetailsComponent } from './component/pokemon-details/pokemon-details.component';
import { MainContainerComponent } from './component/main-container/main-container.component';
import { Page404Component } from './component/page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    PokemonIdFormatPipe,
    HeaderComponent,
    FooterComponent,
    PokemonDetailsComponent,
    MainContainerComponent,
    Page404Component
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
