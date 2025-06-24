import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostLovedComponent } from './most-loved.component';

describe('MostLovedComponent', () => {
  let component: MostLovedComponent;
  let fixture: ComponentFixture<MostLovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostLovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostLovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
