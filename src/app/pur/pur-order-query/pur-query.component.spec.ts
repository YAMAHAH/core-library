import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseOrderQueryComponent } from './pur-order-query.component';


describe('PurQueryComponent', () => {
  let component: PurchaseOrderQueryComponent;
  let fixture: ComponentFixture<PurchaseOrderQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseOrderQueryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
