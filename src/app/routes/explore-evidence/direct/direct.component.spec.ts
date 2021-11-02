import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreEvidenceDirectComponent } from './direct.component';

describe('ExploreEvidenceDirectComponent', () => {
  let component: ExploreEvidenceDirectComponent;
  let fixture: ComponentFixture<ExploreEvidenceDirectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExploreEvidenceDirectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreEvidenceDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
