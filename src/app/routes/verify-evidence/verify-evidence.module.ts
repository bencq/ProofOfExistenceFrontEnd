import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzResultModule } from 'ng-zorro-antd/result';

import { ResultErrorComponent, ResultSuccessComponent, VerifyEvidenceDirectComponent } from './direct/direct.component';
import { VerifyEvidenceRoutingModule } from './verify-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [VerifyEvidenceDirectComponent, ResultSuccessComponent, ResultErrorComponent];

@NgModule({
  imports: [SharedModule, NzResultModule, VerifyEvidenceRoutingModule],
  declarations: COMPONENTS
})
export class VerifyEvidenceModule {}
