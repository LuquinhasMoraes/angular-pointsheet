export default class CargaHorariaModel {
    idCargaHoraria: number;
    dataEntrada: Date;
    inicioJornada: Date;
    inicioAlmoco: Date;
    fimAlmoco: Date;
    tempoDeAlmoco: number;
    fimJornada: Date;
    horasTrabalhadas: number;
    uiHorasTrabalhadas: string;
    diferencaHorasTrabalhadas: number;
    uiDiferencaHorasTrabalhadas: string;
    folga: boolean;
    uiPercentual: number;

    constructor(cargaHorariaModel: CargaHorariaModel) {
        this.idCargaHoraria = cargaHorariaModel.idCargaHoraria;        
        this.dataEntrada = cargaHorariaModel.dataEntrada;        
        this.inicioJornada = cargaHorariaModel.inicioJornada;        
        this.inicioAlmoco = cargaHorariaModel.inicioAlmoco;        
        this.fimAlmoco = cargaHorariaModel.fimAlmoco;  
        this.tempoDeAlmoco = cargaHorariaModel.tempoDeAlmoco;      
        this.fimJornada = cargaHorariaModel.fimJornada;        
        this.horasTrabalhadas = cargaHorariaModel.horasTrabalhadas; 
        this.diferencaHorasTrabalhadas = cargaHorariaModel.diferencaHorasTrabalhadas;   
        this.uiHorasTrabalhadas = this.convertDecimalToHours(cargaHorariaModel.horasTrabalhadas == null ? "" : cargaHorariaModel.horasTrabalhadas.toString());    
        this.uiDiferencaHorasTrabalhadas = this.convertDecimalToHours(cargaHorariaModel.diferencaHorasTrabalhadas == null ? "" : cargaHorariaModel.diferencaHorasTrabalhadas.toString());    
        this.folga = cargaHorariaModel.folga;
        this.uiPercentual = this.definePercentualTrabalhado(cargaHorariaModel.horasTrabalhadas);        
    }

    private definePercentualTrabalhado(horasTrabalhadas: number) : number {
        
        if(horasTrabalhadas <= 0) {
            return 0;
        }

        const horaBase = 8;
        const percentual = Math.trunc( horasTrabalhadas * 100 / horaBase);
        console.log(percentual, horasTrabalhadas);
        return percentual;
    }

    private convertDecimalToHours(decimalHora: string) {
    
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
}