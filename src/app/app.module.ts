import { NgModule, isDevMode } from '@angular/core';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import { TraducePipe } from './traduce.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PokemonListComponent,
    PokemonIdFormatPipe,
    HeaderComponent,
    FooterComponent,
    PokemonDetailsComponent,
    MainContainerComponent,
    Page404Component,
    TraducePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
