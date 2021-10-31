import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';

import { drawerTextDataComponent, SearchEvidenceDirectComponent } from './direct/direct.component';
import { SearchEvidenceRoutingModule } from './search-evidence-routing.module';

const COMPONENTS: Array<Type<void>> = [SearchEvidenceDirectComponent, drawerTextDataComponent];

@NgModule({
  imports: [SharedModule, SearchEvidenceRoutingModule],
  declarations: COMPONENTS
})
export class SearchEvidenceModule {}
