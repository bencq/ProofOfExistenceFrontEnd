import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewDirectComponent } from './direct/direct.component';
import { OverviewExternalLinkComponent } from './external-link/external-link.component';

const routes: Routes = [
  { path: 'direct', component: OverviewDirectComponent },
  { path: '', redirectTo: 'external-link' },

  { path: 'external-link', component: OverviewExternalLinkComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule {}
