import { Injectable } from '@angular/core';
import CargaHorariaModel from 'src/app/Models/CargaHoraria.model';
import { HttpService } from './http.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { convertDecimalToHours } from './Helpers/zeraHoras';

@Injectable({
  providedIn: 'root'
})
export class CargaHorariaService {

  // Lista de horários
  listaCargaHoraria: Subject<CargaHorariaModel[]> = new Subject<CargaHorariaModel[]>();
  
  // Indicadores de dashboards
  totalHorasTrabalhadas: BehaviorSubject<string> = new BehaviorSubject<string>("");
  totalDiasTrabalhados: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalFolgas: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalDiffHoras: BehaviorSubject<string> = new BehaviorSubject<string>("");
  mediaTempoDeAlmoco: BehaviorSubject<string> = new BehaviorSubject<string>("00:00");
  
  constructor(private httpService: HttpService) {
    this.listaCargaHorariaObservable().subscribe((cargaHoraria: CargaHorariaModel[]) => {
      this.setMediaTempoDeAlmoco(cargaHoraria);
      this.setTotalHorasTrabalhadas(cargaHoraria);
      this.setTotalDiasTrabalhados(cargaHoraria);
      this.setTotalFolgas(cargaHoraria);
      this.setTotalDiffHoras(cargaHoraria);
    });
  }

  public setCargaHoraria(value: CargaHorariaModel[]) {
    this.listaCargaHoraria.next(value);
  }

  setMediaTempoDeAlmoco(cargaHoraria: CargaHorariaModel[]) {
    console.log(cargaHoraria);
    if(cargaHoraria != null) {
      const numeroDeElementos = cargaHoraria.length;
      const totalTempoDeAlmoco = cargaHoraria.map(x => x.tempoDeAlmoco).reduce((a, b) => a + b, 0);
      const mediaDeTempoDeAlmoco = totalTempoDeAlmoco / numeroDeElementos;
      const mediaDeTempoDeAlmocoString: string = convertDecimalToHours(mediaDeTempoDeAlmoco.toString());
      this.mediaTempoDeAlmoco.next(mediaDeTempoDeAlmocoString);
    }
    
  }

  getMediaTempoDeAlmoco() {
    return this.mediaTempoDeAlmoco.asObservable();
  }

  setTotalHorasTrabalhadas(cargaHoraria: CargaHorariaModel[]) {
    const totalHoras = cargaHoraria.map(x => x.horasTrabalhadas).reduce((a, b) => a + b, 0);
    const totalHorasEmMinutos: string = convertDecimalToHours(totalHoras.toString()); 
    this.totalHorasTrabalhadas.next(totalHorasEmMinutos);
  }

  getTotalHorasTrabalhadas() {
    return this.totalHorasTrabalhadas.asObservable();
  }

  setTotalDiasTrabalhados(cargaHoraria: CargaHorariaModel[]) {
    const diasTrabalhadas = cargaHoraria.filter(x => !x.folga).length;
    this.totalDiasTrabalhados.next(diasTrabalhadas);
  }

  getTotalDiasTrabalhados() {
    return this.totalDiasTrabalhados.asObservable();
  }

  setTotalFolgas(cargaHoraria: CargaHorariaModel[]) {
    const folgas = cargaHoraria.filter(x => x.folga).length;
    this.totalFolgas.next(folgas);
  }

  getTotalFolgas() {
    return this.totalFolgas.asObservable();
  }
  
  setTotalDiffHoras(cargaHoraria: CargaHorariaModel[]) {
    const totalHoras = cargaHoraria
                        .filter(x => !x.folga)
                        .map(x => x.diferencaHorasTrabalhadas).
                        reduce((a, b) => a + b, 0);
    
    const totalHorasEmMinutos: string = convertDecimalToHours(totalHoras.toString()); 
    this.totalDiffHoras.next(totalHorasEmMinutos);
  }

  getTotalDiffHoras() {
    return this.totalDiffHoras.asObservable();
  }

  listaCargaHorariaObservable() {
    return this.listaCargaHoraria.asObservable();
  }

  public obtemCargaHoraria() {
    return this.httpService.getObs('CargaHoraria/Lista').subscribe((response: CargaHorariaModel[]) => {
      this.setCargaHoraria(response.map(x => new CargaHorariaModel(x)));
    });
  }

  public iniciaJornadaDeTrabalho(cargaHorariaModel: CargaHorariaModel) {
    return this.httpService.postObs('CargaHoraria/Iniciar').subscribe(response => {
      this.obtemCargaHoraria();
    });
  }

  public criaFolga() {
    return this.httpService.postObs('CargaHoraria/CriaFolga').subscribe(response => {
      console.log(response);
      
      this.obtemCargaHoraria();
    });
  }

  public atualizaExpediente(idCargaHoraria: number, tipo: number) {
    return this.httpService.putObs('CargaHoraria/Atualiza?idCargaHoraria=' + idCargaHoraria + '&' + 'tipoAtualizacao=' + tipo, null).subscribe(response => {
      this.obtemCargaHoraria();
    });
  }
}
