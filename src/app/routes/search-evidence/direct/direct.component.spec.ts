import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEvidenceDirectComponent } from './direct.component';

describe('SearchEvidenceDirectComponent', () => {
  let component: SearchEvidenceDirectComponent;
  let fixture: ComponentFixture<SearchEvidenceDirectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SearchEvidenceDirectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEvidenceDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
