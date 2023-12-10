export class Filter {
  filterId: number;
  name: string;
  active: boolean;

  constructor(filterId: number, name: string, active: boolean){
    this.filterId = filterId;
    this.name = name;
    this.active = active;
  }
}
