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
{
  en: 'Height and weight',
  es: 'Altura y Peso',
},
{
  en: 'Description',
  es: 'Descripción',
},
{
  en: 'Base Stats',
  es: 'Estadísticas Base',
},
{
  en: 'Health: ',
  es: 'Puntos de Vida: ',
},
{
  en: 'Attack: ',
  es: 'Ataque: ',
},
{
  en: 'Defense: ',
  es: 'Defensa: ',
},
{
  en: 'Special Attack: ',
  es: 'Ataque Especial: ',
},
{
  en: 'Special Defense: ',
  es: 'Defensa Especial: ',
},
{
  en: 'Speed: ',
  es: 'Velocidad: ',
},
{
  en: 'Weak',
  es: 'Débil',
},
{
  en: 'Very Weak',
  es: 'Muy Débil',
},
{
  en: 'Strong',
  es: 'Fuerte',
},
{
  en: 'Very Strong',
  es: 'Muy fuerte',
},
{
  en: 'Not effective',
  es: 'No afecta',
},
{
  en: 'Learned By Level',
  es: 'Aprende Por Nivel',
},
{
  en: 'Learned By MT',
  es: 'Aprende por MT',
},
{
  en: 'Name',
  es: 'Nombre',
},
{
  en: 'Accuracy',
  es: 'Precisión',
},
{
  en: 'Power',
  es: 'Potencia',
},
{
  en: 'Type',
  es: 'Tipo',
},
{
  en: 'Class',
  es: 'Categoría',
},
{
  en: 'Level',
  es: 'Nivel',
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