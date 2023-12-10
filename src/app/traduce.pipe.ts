import { Pipe, PipeTransform } from '@angular/core';
const TRADUCCIONES = [
{
  en: 'fire',
  es: 'Fuego',
},
{
  en: 'water',
  es: 'Agua',
},
{
  en: 'grass',
  es: 'Planta',
},
{
  en: 'rock',
  es: 'Roca',
},
{
  en: 'bug',
  es: 'Bicho',
},
{
  en: 'dark',
  es: 'Siniestro',
},
{
  en: 'fairy',
  es: 'Hada',
},
{
  en: 'dragon',
  es: 'Dragon',
},
{
  en: 'electric',
  es: 'Eléctrico',
},
{
  en: 'ground',
  es: 'Tierra',
},
{
  en: 'fighting',
  es: 'Lucha',
},
{
  en: 'ghost',
  es: 'Fantasma',
},
{
  en: 'poison',
  es: 'Veneno',
},
{
  en: 'steel',
  es: 'Metal',
},
{
  en: 'flying',
  es: 'Volador',
},
{
  en: 'ice',
  es: 'Hielo',
},
{
  en: 'normal',
  es: 'Normal',
},
{
  en: 'psychic',
  es: 'Psíquico',
},
];
type Idioma = 'en' | 'es';

@Pipe({
name: 'traducir',
})

export class TraducePipe implements PipeTransform {
transform(texto: string, idioma: Idioma): string {
const traduccion = TRADUCCIONES.filter(t => t['en'] === texto)[0];

if (traduccion) {
  if(localStorage.getItem('language') == 'es'){
    return traduccion['es']
  }else{
    return traduccion['en']
  }
} else {
return '';
}
}
}