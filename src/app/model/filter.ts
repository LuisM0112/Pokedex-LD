export class Filter {
  id: number;
  type: string;
  name: string;
  active: boolean;

  constructor(id: number, type: string, name: string, active: boolean){
    this.id = id;
    this.type = type;
    this.name = name;
    this.active = active;
  }
}
