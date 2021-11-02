import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { ExploreEvidenceDirectComponent } from './direct/direct.component';
import { ExploreEvidenceRoutingModule } from './explore-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [ExploreEvidenceDirectComponent];

@NgModule({
  imports: [SharedModule, ExploreEvidenceRoutingModule, NzDescriptionsModule, NzSkeletonModule],
  declarations: COMPONENTS
})
export class ExploreEvidenceModule {}
