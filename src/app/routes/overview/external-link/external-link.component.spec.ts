import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewExternalLinkComponent } from './external-link.component';

describe('OverviewExternalLinkComponent', () => {
  let component: OverviewExternalLinkComponent;
  let fixture: ComponentFixture<OverviewExternalLinkComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OverviewExternalLinkComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewExternalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
