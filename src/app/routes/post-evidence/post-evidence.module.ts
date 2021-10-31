import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzResultModule } from 'ng-zorro-antd/result';

import { PostEvidenceDirectComponent, ResultErrorComponent, ResultSuccessComponent } from './direct/direct.component';
import { PostEvidenceRoutingModule } from './post-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [PostEvidenceDirectComponent, ResultSuccessComponent, ResultErrorComponent];

@NgModule({
  imports: [SharedModule, NzResultModule, PostEvidenceRoutingModule, NzDescriptionsModule],
  declarations: COMPONENTS
})
export class PostEvidenceModule {}
