export function zeraHoras(dataComHoras: Date): Date {
    dataComHoras = new Date(dataComHoras.getFullYear(), dataComHoras.getMonth(), dataComHoras.getDate(),0,0,0,0);
    return dataComHoras;
}

export function convertDecimalToHours(decimalHora: string) {
    
    if(parseFloat(decimalHora) % 1 === 0) {
        decimalHora = parseFloat(decimalHora).toFixed(2).toString();
    } 
    var n = new Date(0,0);
    let horas               = parseFloat(decimalHora.split(".")[0]);
    let minutosEmDecimal    = parseFloat(decimalHora.split(".")[1]);
    let minutosEmTime = (minutosEmDecimal / 100 * 60);
    n.setMinutes(+minutosEmTime.toFixed(0));

    let minFinal = minutosEmTime == 0 ? minutosEmTime + "0" : minutosEmTime.toString();

    return horas.toString() +  ':' + minFinal.substr(0,2);
}