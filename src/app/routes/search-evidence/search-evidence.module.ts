import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NzCardModule } from 'ng-zorro-antd/card';

import { drawerEvidenceDataComponent, SearchEvidenceDirectComponent } from './direct/direct.component';
import { SearchEvidenceRoutingModule } from './search-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [SearchEvidenceDirectComponent, drawerEvidenceDataComponent];

@NgModule({
  imports: [SharedModule, SearchEvidenceRoutingModule, NzCardModule],
  declarations: COMPONENTS
})
export class SearchEvidenceModule {}
