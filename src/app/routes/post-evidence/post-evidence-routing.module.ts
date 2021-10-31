import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostEvidenceDirectComponent } from './direct/direct.component';

const routes: Routes = [{ path: 'direct', component: PostEvidenceDirectComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostEvidenceRoutingModule {}
