import { TestBed } from '@angular/core/testing';

import { ShAPIService } from './sh-api.service';

describe('ShAPIService', () => {
  let service: ShAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
