import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEvidenceFileComponent } from './file.component';

describe('PostEvidenceFileComponent', () => {
  let component: PostEvidenceFileComponent;
  let fixture: ComponentFixture<PostEvidenceFileComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PostEvidenceFileComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEvidenceFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
