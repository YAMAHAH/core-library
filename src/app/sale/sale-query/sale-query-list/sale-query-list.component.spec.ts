import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleQueryListComponent } from './sale-query-list.component';

describe('SaleQueryListComponent', () => {
  let component: SaleQueryListComponent;
  let fixture: ComponentFixture<SaleQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleQueryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
