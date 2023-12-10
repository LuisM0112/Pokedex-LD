import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContainerComponent } from './component/main-container/main-container.component';
import { PokemonDetailsComponent } from './component/pokemon-details/pokemon-details.component';
import { Page404Component } from './component/page404/page404.component';

const routes: Routes = [
  {path: 'pokemon-list', component: MainContainerComponent},
  {path: 'pokemon-detail/:pokemonId', component: PokemonDetailsComponent},
  {path: '', redirectTo: '/pokemon-list', pathMatch: 'full'},
  {path: '**', component: Page404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
