import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { PostEvidenceDirectComponent, ResultErrorComponent, ResultSuccessComponent } from './direct/direct.component';
import { PostEvidenceDynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { PostEvidenceFileComponent } from './file/file.component';
import { PostEvidenceRoutingModule } from './post-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [
  PostEvidenceDirectComponent,
  ResultSuccessComponent,
  ResultErrorComponent,
  PostEvidenceDynamicFormComponent,
  PostEvidenceFileComponent
];

@NgModule({
  imports: [SharedModule, NzResultModule, PostEvidenceRoutingModule, NzDescriptionsModule, NzToolTipModule, NzSpaceModule, NzInputModule],
  declarations: COMPONENTS
})
export class PostEvidenceModule {}
