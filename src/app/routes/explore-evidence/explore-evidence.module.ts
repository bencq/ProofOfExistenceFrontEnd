import { NgModule, Type } from '@angular/core';
import { DownFileModule } from '@delon/abc/down-file';
import { SharedModule } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { ExploreEvidenceDirectComponent } from './direct/direct.component';
import { ExploreEvidenceRoutingModule } from './explore-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [ExploreEvidenceDirectComponent];

@NgModule({
  imports: [SharedModule, ExploreEvidenceRoutingModule, NzDescriptionsModule, NzSkeletonModule, DownFileModule],
  declarations: COMPONENTS
})
export class ExploreEvidenceModule {}
