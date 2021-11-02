import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExploreEvidenceDirectComponent } from './direct/direct.component';

const routes: Routes = [
  { path: '', redirectTo: 'direct' },
  { path: 'direct/:evidenceAddress', component: ExploreEvidenceDirectComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreEvidenceRoutingModule {}
