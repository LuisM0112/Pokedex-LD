import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idFormat'
})
export class IdFormatPipe implements PipeTransform {

  transform(id: number, ...args: unknown[]): string {
    return isNaN(id)? "Invalid Input" : id.toString().padStart(3, '0');
  }

}
