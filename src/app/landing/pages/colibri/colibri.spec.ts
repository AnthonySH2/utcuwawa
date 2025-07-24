import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Colibri } from './colibri';

describe('Colibri', () => {
  let component: Colibri;
  let fixture: ComponentFixture<Colibri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Colibri]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Colibri);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
