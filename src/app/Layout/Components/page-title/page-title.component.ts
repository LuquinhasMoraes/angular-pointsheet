import {Component, Input} from '@angular/core';
import CargaHorariaModel from 'src/app/Models/CargaHoraria.model';
import { CargaHorariaService } from 'src/app/shared/Services/carga-horaria.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent {

  @Input() heading;
  @Input() subheading;
  @Input() icon;

  /**
   *
   */
  constructor(private cargaHorariaService: CargaHorariaService) {
    
  }

  iniciaJornadaDeTrabalho() {
    const cargaHorariaService = new CargaHorariaModel();
    this.cargaHorariaService.iniciaJornadaDeTrabalho(cargaHorariaService);
  }

}
