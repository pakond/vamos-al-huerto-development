import { TestBed } from '@angular/core/testing';

import { PlantacionService } from './plantacion.service';

describe('PlantacionService', () => {
  let service: PlantacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
