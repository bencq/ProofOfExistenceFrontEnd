import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewDirectComponent } from './direct/direct.component';

const routes: Routes = [
  { path: 'direct', component: OverviewDirectComponent },
  { path: '', redirectTo: 'direct' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule {}
