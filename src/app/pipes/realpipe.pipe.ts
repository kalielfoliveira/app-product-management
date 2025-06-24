import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'real',
  standalone: true
})
export class RealPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
