import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyEvidenceDirectComponent } from './direct/direct.component';

const routes: Routes = [
  { path: 'direct', component: VerifyEvidenceDirectComponent },
  { path: '', redirectTo: 'direct' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyEvidenceRoutingModule {}
