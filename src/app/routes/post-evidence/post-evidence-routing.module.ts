import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanLeaveProvide } from '../delon/guard/can-leave.provide';
import { UnsaveGuard } from '../delon/guard/unsave.guard';
import { PostEvidenceDirectComponent } from './direct/direct.component';
import { PostEvidenceDynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { PostEvidenceFileComponent } from './file/file.component';

const routes: Routes = [
  { path: 'direct', component: PostEvidenceDirectComponent, canDeactivate: [UnsaveGuard] },
  { path: '', redirectTo: 'direct' },
  { path: 'dynamic-form', component: PostEvidenceDynamicFormComponent, canDeactivate: [UnsaveGuard] },
  { path: 'file', component: PostEvidenceFileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UnsaveGuard]
})
export class PostEvidenceRoutingModule {}
