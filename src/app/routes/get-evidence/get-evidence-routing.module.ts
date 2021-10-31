import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetEvidenceAddressComponent } from './address/address.component';

const routes: Routes = [{ path: 'address', component: GetEvidenceAddressComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetEvidenceRoutingModule {}
