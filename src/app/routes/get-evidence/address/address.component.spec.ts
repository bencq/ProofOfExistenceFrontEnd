import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEvidenceAddressComponent } from './address.component';

describe('GetEvidenceAddressComponent', () => {
  let component: GetEvidenceAddressComponent;
  let fixture: ComponentFixture<GetEvidenceAddressComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GetEvidenceAddressComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GetEvidenceAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
