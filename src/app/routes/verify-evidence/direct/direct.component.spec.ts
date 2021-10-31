import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEvidenceDirectComponent } from './direct.component';

describe('VerifyEvidenceDirectComponent', () => {
  let component: VerifyEvidenceDirectComponent;
  let fixture: ComponentFixture<VerifyEvidenceDirectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [VerifyEvidenceDirectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEvidenceDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
