import { Injectable } from '@angular/core';
import CargaHorariaModel from 'src/app/Models/CargaHoraria.model';
import { HttpService } from './http.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaHorariaService {

  listaCargaHoraria: BehaviorSubject<CargaHorariaModel[]> = new BehaviorSubject<CargaHorariaModel[]>([]);
  
  constructor(private httpService: HttpService) { }

  public setCargaHoraria(value: CargaHorariaModel[]) {
    this.listaCargaHoraria.next(value);
  }

  listaCargaHorariaObservable() {
    return this.listaCargaHoraria.asObservable();
  }

  public obtemCargaHoraria() {
    return this.httpService.getObs('CargaHoraria').subscribe(response => {
      this.setCargaHoraria(response);
    });
  }

  public iniciaJornadaDeTrabalho(cargaHorariaModel: CargaHorariaModel) {
    return this.httpService.postObs('CargaHoraria/Iniciar', cargaHorariaModel).subscribe(response => {
      this.setCargaHoraria(response);
    });
  }
}
