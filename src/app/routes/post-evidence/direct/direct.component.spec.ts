import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEvidenceDirectComponent } from './direct.component';

describe('PostEvidenceDirectComponent', () => {
  let component: PostEvidenceDirectComponent;
  let fixture: ComponentFixture<PostEvidenceDirectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PostEvidenceDirectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEvidenceDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
