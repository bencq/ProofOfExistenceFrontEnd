import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TokenService } from '@delon/auth';

import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  providers: [TokenService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
