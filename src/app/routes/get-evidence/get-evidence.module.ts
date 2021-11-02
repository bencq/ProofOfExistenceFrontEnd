import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { GetEvidenceAddressComponent, ResultErrorComponent, ResultSuccessComponent } from './address/address.component';
import { GetEvidenceRoutingModule } from './get-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [GetEvidenceAddressComponent, ResultSuccessComponent, ResultErrorComponent];

@NgModule({
  imports: [SharedModule, NzResultModule, GetEvidenceRoutingModule, NzDescriptionsModule, NzToolTipModule],
  declarations: COMPONENTS
})
export class GetEvidenceModule {}
