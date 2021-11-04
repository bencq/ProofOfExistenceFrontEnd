// import { Component, OnInit } from '@angular/core';
// import { _HttpClient } from '@delon/theme';

// @Component({
//   selector: 'app-get-evidence-address',
//   templateUrl: './address.component.html',
// })
// export class GetEvidenceAddressComponent implements OnInit {

//   constructor(private http: _HttpClient) { }

//   ngOnInit(): void { }

// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-get-evidence-address',
  templateUrl: './address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetEvidenceAddressComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  isLoading = true;
  optionList: string[] = [];
  readonly contentTypeValues: string[] = ['evidenceAddress', 'evidenceID', 'evidenceName'];
  readonly contentData2Chinese: { [key: string]: string } = {
    evidenceAddress: '存证地址',
    evidenceID: '存证ID',
    evidenceName: '存证名称'
  };

  cotentDataValidator = (control: FormControl): { [s: string]: boolean } => {
    console.log(this);
    if (!control.value) {
      return { error: true, required: true };
    } else {
      if (this.contentType.value === this.contentTypeValues[0]) {
        return {};
      } else if (this.contentType.value === this.contentTypeValues[1] && /^\+?(0|[1-9]\d*)$/.test(control.value.trim())) {
        return {};
      } else if (this.contentType.value === this.contentTypeValues[2]) {
        return {};
      } else {
        return { error: true };
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private settings: SettingsService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      contentData: [null, [this.cotentDataValidator]],
      contentType: [this.contentTypeValues[0], [Validators.required]]
      // username: [null, [Validators.required]]
    });
    this.optionList.push(this.settings.user.username!);
  }

  get contentData(): AbstractControl {
    return this.form.controls.contentData;
  }

  get contentType(): AbstractControl {
    return this.form.controls.contentType;
  }

  // get username(): AbstractControl {
  //   return this.form.controls.username;
  // }

  contentTypeChanged(ra: any): void {
    console.log(ra);
    // this.contentData.setValidators([Validators.required, this.cotentDataValidator]);
    this.contentData.markAsDirty();
    this.contentData.updateValueAndValidity();
  }

  contentDataErrorTip(): string {
    return this.contentData2Chinese[this.contentType.value];
  }

  submit(): void {
    console.log(this.contentData);
    this.submitting = true;
    this.http
      .post('exportedAPI/v1', {
        apiName: 'getEvidence',
        contentData: this.contentData.value.trim(),
        contentType: this.contentType.value.trim()
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.submitting = false;
        this.cdr.detectChanges();
        if (res.status !== 0) {
          this.modal.error({
            nzTitle: '获取结果',
            nzContent: ResultErrorComponent,
            nzCentered: true,
            nzComponentParams: {
              message: res.message
            },
            nzWidth: (1920 * 2) / 3,
            nzOnOk: () => {
              console.log('not ok');
            }
          });
        } else {
          this.modal.success({
            nzTitle: '获取结果',
            nzContent: ResultSuccessComponent,
            nzCentered: true,
            nzComponentParams: {
              username: res.data.username,
              evidenceName: res.data.evidenceName,
              evidenceID: res.data.evidenceID,
              evidenceAddress: res.data.evidenceAddress,
              timestamp: (() => {
                let timestamp = new Date(res.data.timestamp);
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
              })(),
              // evidenceData: res.data.evidenceData,
              evidenceHash: res.data.evidenceHash,
              transactionHash: res.data.transactionHash,
              blockNumber: res.data.blockNumber
            },
            nzWidth: (1920 * 2) / 3,
            nzOnOk: () => {
              console.log('ok');
            }
          });
        }
      });
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
      console.log(key, this.form.controls[key].value);
    });
    if (this.form.invalid) {
      return;
    }
  }
}

@Component({
  selector: 'app-result-success',
  template: `
    <nz-result nzStatus="success" nzTitle="获取成功" nzSubTitle="该存证信息经验证，为用户之前上链存证的内容">
      <div nz-result-content>
        <nz-descriptions nzTitle="存证信息" nzBordered [nzColumn]="1">
          <nz-descriptions-item nzTitle="存证用户">{{ username }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证名称">{{ evidenceName }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证ID">{{ evidenceID }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证地址">
            <a
              nz-tooltip
              nzTooltipTitle="点击跳转至存证浏览器查看该存证"
              [href]="'/#/explore-evidence/direct/' + evidenceAddress"
              target="_blank"
            >
              {{ evidenceAddress }}
            </a>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证时间">{{ timestamp }}</nz-descriptions-item>
          <!-- <nz-descriptions-item nzTitle="存证内容">{{ evidenceData }}</nz-descriptions-item> -->
          <nz-descriptions-item nzTitle="内容哈希"> {{ evidenceHash }} </nz-descriptions-item>
          <nz-descriptions-item nzTitle="交易哈希">{{ transactionHash }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="区块高度">{{ blockNumber }}</nz-descriptions-item>
        </nz-descriptions>
      </div>
    </nz-result>
  `
})
export class ResultSuccessComponent {
  @Input() username?: string;
  @Input() evidenceName?: string;
  @Input() evidenceID?: string;
  @Input() evidenceAddress?: string;
  @Input() timestamp?: string;
  // @Input() evidenceData?: string;
  @Input() evidenceHash?: string;
  @Input() transactionHash?: string;
  @Input() blockNumber?: string;
  // @Input() signatures?: string[];
}
@Component({
  selector: 'app-result-error',
  template: `
    <nz-result nzStatus="error" nzTitle="获取失败" nzSubTitle="找不到对应存证地址的存证数据！">
      <div nz-result-content>
        <div class="desc">
          <p nz-paragraph
            ><code><b>错误信息：</b></code> {{ message }}</p
          >
        </div>
      </div>
    </nz-result>
  `
})
export class ResultErrorComponent {
  @Input() message?: string;
}
