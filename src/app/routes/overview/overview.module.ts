import { NgModule, Type } from '@angular/core';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { G2BarModule } from '@delon/chart/bar';
import { G2CardModule } from '@delon/chart/card';
import { G2MiniBarModule } from '@delon/chart/mini-bar';
import { SharedModule } from '@shared';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { OverviewDirectComponent } from './direct/direct.component';
import { OverviewRoutingModule } from './overview-routing.module';

const COMPONENTS: Array<Type<void>> = [OverviewDirectComponent];

@NgModule({
  imports: [SharedModule, OverviewRoutingModule, G2MiniBarModule, G2CardModule, NzIconModule, QuickMenuModule],
  declarations: COMPONENTS
})
export class OverviewModule {}
