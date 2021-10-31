import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-evidence-direct',
  templateUrl: './direct.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchEvidenceDirectComponent implements OnInit {
  queryParams: {
    // pi: number;
    // ps: number;
    apiName: string;
    username: string;
    sorter: string;
    blockNumber: number | null;
    dateRange: Date[] | null;
  } = {
    // pi: 1,
    // ps: 10,
    apiName: 'searchEvidence',
    username: '',
    sorter: '',
    blockNumber: null,
    dateRange: null
  };
  data: any[] = [];
  loading = false;
  status = [
    { index: 0, text: '关闭', value: false, type: 'default', checked: false },
    {
      index: 1,
      text: '运行中',
      value: false,
      type: 'processing',
      checked: false
    },
    { index: 2, text: '已上线', value: false, type: 'success', checked: false },
    { index: 3, text: '异常', value: false, type: 'error', checked: false }
  ];
  @ViewChild('st', { static: true })
  st!: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '存证ID', index: 'evidenceID', sort: true },
    { title: '上链用户', index: 'username' },
    {
      title: '上链时间',
      index: 'timestamp',
      sort: true,
      format: (item, col, index) => {
        let timestamp = new Date(item.timestamp);
        let date = new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }).format(timestamp);
        let time = new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        }).format(timestamp);
        let ts = `${date} ${time}`;
        console.log(ts);
        return ts;
      }
    },
    { title: '区块高度', index: 'blockNumber', sort: true },
    { title: '交易哈希', index: 'transactionHash' },
    { title: '存证地址', index: 'evidenceAddress' },
    {
      title: '存证内容&哈希',
      index: 'textData',
      buttons: [
        {
          text: '详情',
          type: 'drawer',
          drawer: {
            title: '存证内容&哈希',
            component: drawerTextDataComponent,
            params: record => {
              return {
                textData: record.textData,
                evidenceHash: record.evidenceHash
              };
            },
            drawerOptions: { nzWidth: 512 }
          }
        }
      ]
    }
    // { title: '内容哈希', buttons: [{ text: '详情', type: 'drawer', drawer: { title: '内容哈希' } }] }
    // {
    //   title: '服务调用次数',
    //   index: 'callNo',
    //   type: 'number',
    //   format: item => `${item.callNo} 万`,
    //   sort: {
    //     compare: (a, b) => a.callNo - b.callNo
    //   }
    // },
    // {
    //   title: '状态',
    //   index: 'status',
    //   render: 'status',
    //   filter: {
    //     menus: this.status,
    //     fn: (filter, record) => record.status === filter.index
    //   }
    // },
    // {
    //   title: '更新时间',
    //   index: 'updatedAt',
    //   type: 'date',
    //   sort: {
    //     compare: (a, b) => a.updatedAt - b.updatedAt
    //   }
    // },
    // {
    //   title: '操作',
    //   buttons: [
    //     {
    //       text: '配置',
    //       click: item => this.msg.success(`配置${item.no}`)
    //     },
    //     {
    //       text: '订阅警报',
    //       click: item => this.msg.success(`订阅警报${item.no}`)
    //     }
    //   ]
    // }
  ];
  selectedRows: STData[] = [];
  description = '';

  constructor(private http: _HttpClient, public msg: NzMessageService, private modalSrv: NzModalService, private cdr: ChangeDetectorRef) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  getData(): void {
    this.loading = true;
    // this.queryParams.blockNumberList = this.status.filter(w => w.checked).map(item => item.index);
    // if (this.queryParams.blockNumber !== null && this.queryParams.blockNumber > -1) {
    //   this.queryParams.blockNumberList.push(this.queryParams.blockNumber);
    // }
    console.log(this.queryParams);
    this.http
      .post('exportedAPI/v1', this.queryParams)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(res => {
        console.log(res);
        this.data = res.data.evidences;
        this.cdr.detectChanges();
      });
  }

  stChange(e: STChange): void {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove(): void {
    this.http.delete('/rule', { nos: this.selectedRows.map(i => i.no).join(',') }).subscribe(() => {
      this.getData();
      this.st.clearCheck();
    });
  }

  approval(): void {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  reset(): void {
    // wait form reset updated finished
    // setTimeout(() => this.getData());
  }
}

@Component({
  selector: 'app-drawer-textData',
  template: `
    <nz-card style="width:100%; " nzTitle="存证内容">
      {{ textData }}
    </nz-card>
    <nz-divider></nz-divider>
    <nz-card style="width:100%; " nzTitle="存证哈希"> {{ evidenceHash }} </nz-card>
    <div class="drawer-footer">
      <button nz-button (click)="cancel()"> Cancel </button>
      <button nz-button (click)="ok()"> OK </button>
    </div>
  `
})
export class drawerTextDataComponent {
  @Input() textData: NzSafeAny;
  @Input() evidenceHash: NzSafeAny;

  constructor(private ref: NzDrawerRef) {}

  ok(): void {
    this.ref.close(`new time: ${+new Date()}`);
    this.cancel();
  }

  cancel(): void {
    this.ref.close();
  }
}
