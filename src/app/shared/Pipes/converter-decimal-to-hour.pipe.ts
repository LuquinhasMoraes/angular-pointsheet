import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'converterDecimalToHour'
})
export class ConverterDecimalToHourPipe implements PipeTransform {

  transform(decimalHora: any, args?: any): any {
    
    if(parseFloat(decimalHora) % 1 === 0) {
        //console.log(decimalHora);
        decimalHora = parseFloat(decimalHora).toFixed(2).toString();
    } 
    var n = new Date(0,0);
    let horas               = parseFloat(decimalHora.split(".")[0]);
    let minutosEmDecimal    = parseFloat(decimalHora.split(".")[1]);
    let minutosEmTime = (minutosEmDecimal / 100 * 60);
    n.setMinutes(+minutosEmTime.toFixed(0));
    return horas.toString() + n.toTimeString().slice(2, 5);
  }

}
