import { TestBed } from '@angular/core/testing';

import { CargaHorariaService } from './carga-horaria.service';

describe('CargaHorariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CargaHorariaService = TestBed.get(CargaHorariaService);
    expect(service).toBeTruthy();
  });
});
