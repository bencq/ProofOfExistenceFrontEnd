import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';

import i18nJson from '../../../../assets/tmp/i18n/zh-CN.json';

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
    // username: string;
    evidenceName: string | null;
    evidenceType: string | null;
    sorter: string;
    blockNumber: number | null;
    dateRange: Date[] | null;
  } = {
    // pi: 1,
    // ps: 10,
    apiName: 'searchEvidence',
    evidenceName: null,
    evidenceType: null,
    // username: '',
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
    // { title: '', index: 'key', type: 'checkbox' },
    { title: '存证名称', index: 'evidenceName', sort: true },
    { title: '存证ID', index: 'evidenceID', sort: true },
    {
      title: '存证类型',
      index: 'evidenceType',
      width: '8%',
      format: (item, col, index) => {
        // return this.i18n.translate(item.evidenceType);
        let key: 'file' | 'json' | 'text' = item.evidenceType;
        return i18nJson[key];
      }
    },
    { title: '存证地址', index: 'evidenceAddress', width: '40%' },
    // { title: '上链用户', index: 'username' },
    { title: '区块高度', index: 'blockNumber', sort: true, width: '8%' },
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
        return ts;
      }
    },
    // { title: '交易哈希', index: 'transactionHash' },

    {
      title: '详情',
      width: '80px',
      buttons: [
        {
          text: '详情',
          tooltip: '点击跳转至存证浏览器查看该存证',
          type: 'link',
          click: (record: STData, modal?: any, instance?: STComponent) => {
            return `/explore-evidence/direct/${record.evidenceAddress}`;
          }
        }
      ]
    }
    // {
    //   title: '存证内容&哈希',
    //   index: 'evidenceData',
    //   buttons: [
    //     {
    //       text: '详情',
    //       type: 'drawer',
    //       drawer: {
    //         title: '存证内容&哈希',
    //         component: drawerEvidenceDataComponent,
    //         params: record => {
    //           return {
    //             evidenceData: record.evidenceData,
    //             evidenceHash: record.evidenceHash
    //           };
    //         },
    //         drawerOptions: { nzWidth: 512 }
    //       }
    //     }
    //   ]
    // }
  ];

  selectedRows: STData[] = [];
  description = '';

  readonly evidenceTypes = ['text', 'json', 'file'];

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private i18n: I18NService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // console.log(this.i18n.defaultLang);
    // this.i18n.use('zh-CN', {});
  }

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
  selector: 'app-drawer-evidenceData',
  template: `
    <nz-card style="width:100%; " nzTitle="存证内容">
      {{ evidenceData }}
    </nz-card>
    <nz-divider></nz-divider>
    <nz-card style="width:100%; " nzTitle="存证哈希"> {{ evidenceHash }} </nz-card>
    <div class="drawer-footer">
      <button nz-button (click)="cancel()"> Cancel </button>
      <button nz-button (click)="ok()"> OK </button>
    </div>
  `
})
export class drawerEvidenceDataComponent {
  @Input() evidenceData: NzSafeAny;
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
