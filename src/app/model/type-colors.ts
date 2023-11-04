export class TypeColors {
  private colors: { [key: string]: string } = {
    default: 'var(--default)',
    normal: 'var(--normal)',
    fire: 'var(--fire)',
    water: 'var(--water)',
    grass: 'var(--grass)',
    electric: 'var(--electric)',
    ice: 'var(--ice)',
    fighting: 'var(--fighting)',
    poison: 'var(--poison)',
    ground: 'var(--ground)',
    flying: 'var(--flying)',
    psychic: 'var(--psychic)',
    bug: 'var(--bug)',
    rock: 'var(--rock)',
    ghost: 'var(--ghost)',
    dragon: 'var(--dragon)',
    dark: 'var(--dark)',
    steel: 'var(--steel)',
    fairy: 'var(--fairy)',
  };

  getColor(type: string): string {
    return this.colors[type] || 'var(--default)';
  }
}
