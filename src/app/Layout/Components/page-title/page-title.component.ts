import {Component, Input} from '@angular/core';
import CargaHorariaModel from 'src/app/Models/CargaHoraria.model';
import { CargaHorariaService } from 'src/app/shared/Services/carga-horaria.service';
import { zeraHoras } from 'src/app/shared/Services/Helpers/zeraHoras';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent {

  @Input() heading;
  @Input() subheading;
  @Input() icon;

  public relex: boolean = false;
  public isFolga: boolean = false;
  public isTrabalhando: boolean = false;
  public isAlmocando: boolean = false;
  public isTerminoAlmoco: boolean = false;
  public isTerminoJornada: boolean = false;
  private cargaHorariaAtual: CargaHorariaModel = null; 
  
  constructor(private cargaHorariaService: CargaHorariaService) {
    this.analisaPeriodoDoTrabalho();
  }

  iniciaJornadaDeTrabalho() {
    var obj: any = {
      dataEntrada: null,
      definePercentualTrabalhado: null,
      diferencaHorasTrabalhadas: null,
      fimAlmoco: null, 
      fimJornada: null,
      folga: 0,
      horasTrabalhadas: null,
      idCargaHoraria: null,
      inicioAlmoco: null,
      inicioJornada: null,
      uiPercentual: null,
    }
    const cargaHorariaService = new CargaHorariaModel(obj);
    this.cargaHorariaService.iniciaJornadaDeTrabalho(cargaHorariaService);
  }

  criaFolga() {
    this.cargaHorariaService.criaFolga();
  }

  analisaPeriodoDoTrabalho() {
    this.cargaHorariaService.listaCargaHorariaObservable().subscribe((res: CargaHorariaModel[]) => {

      const cargaHorariaAtual = res.filter( x => zeraHoras(new Date(new Date(x.dataEntrada).toISOString())).toString() == zeraHoras(new Date()).toString());

      if(cargaHorariaAtual.length > 0) {
        this.cargaHorariaAtual = cargaHorariaAtual[0];

        if(this.cargaHorariaAtual.folga) {
          this.heading = "Aproveite sua folga!";
          this.isFolga = true;
        } else {
          this.relex = false;
          this.isTrabalhando = true;
          this.heading = "Trabalhando...";
  
          const inicioAlmoco = new Date(cargaHorariaAtual[0].inicioAlmoco);
          const fimAlmoco = new Date(cargaHorariaAtual[0].fimAlmoco);
          const fimJornada = new Date(cargaHorariaAtual[0].fimJornada);
  
          console.log(inicioAlmoco, fimAlmoco, fimJornada );
  
          if( inicioAlmoco > new Date(0) && fimAlmoco < new Date(0) && fimJornada < new Date(0)) {
            this.heading = "Almoçando...";
            this.isAlmocando = true;
            this.isTrabalhando = false;
          } else if (fimAlmoco > new Date(0) && fimJornada < new Date(0)) {
            this.heading = "Segundo turno do trabalho...";
            this.isTrabalhando = false;
            this.isAlmocando = false;
            this.isTerminoAlmoco = true;
          } else if (fimJornada > new Date(0)) {
            console.log(fimAlmoco);
            
            this.heading = "Expediente encerrado!";
            this.isTrabalhando = false;
            this.isAlmocando = false;
            this.isTerminoAlmoco = false;
            this.isTerminoJornada = true;
          }
        }

        

      } else {
        this.relex = true;
      }

    });

    
  }

  atualizaExpediente(tipo: number) {
    this.cargaHorariaService.atualizaExpediente(this.cargaHorariaAtual.idCargaHoraria, tipo);
  }

}
