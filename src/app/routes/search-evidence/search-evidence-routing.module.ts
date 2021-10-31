import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchEvidenceDirectComponent } from './direct/direct.component';

const routes: Routes = [
  { path: 'direct', component: SearchEvidenceDirectComponent },
  { path: '', redirectTo: 'direct' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchEvidenceRoutingModule {}
