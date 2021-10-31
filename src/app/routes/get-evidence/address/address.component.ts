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
  contentTypeValues: string[] = ['evidenceAddress', 'evidenceID'];

  cotentDataValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else {
      if (this.contentType.value === this.contentTypeValues[0]) {
        return {};
      } else if (this.contentType.value === this.contentTypeValues[1] && /^\+?(0|[1-9]\d*)$/.test(control.value.trim())) {
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
      contentData: [null, [Validators.required]],
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
    this.contentData.setValidators([Validators.required, this.cotentDataValidator]);
    this.contentData.markAsDirty();
    this.contentData.updateValueAndValidity();
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
          this.modal.create({
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
          this.modal.create({
            nzTitle: '获取结果',
            nzContent: ResultSuccessComponent,
            nzCentered: true,
            nzComponentParams: {
              username: res.data.username,
              evidenceID: res.data.evidenceID,
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
              textData: res.data.textData,
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
          <nz-descriptions-item nzTitle="存证ID">{{ evidenceID }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证时间">{{ timestamp }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证内容">{{ textData }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="内容哈希"> {{ evidenceHash }} </nz-descriptions-item>
          <nz-descriptions-item nzTitle="交易哈希">{{ transactionHash }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="区块高度">{{ blockNumber }}</nz-descriptions-item>
        </nz-descriptions>
        <!-- <div class="desc">
          <p nz-paragraph
            ><code><b>存证用户：</b></code> {{ username }}</p
          >
          <p nz-paragraph
            ><code><b>存证ID：</b></code> {{ evidenceID }}</p
          >
          <p nz-paragraph
            ><code><b>存证时间：</b></code> {{ timestamp }}</p
          >
          <p nz-paragraph
            ><code><b>存证内容：</b></code> {{ textData }}</p
          >
          <p nz-paragraph
            ><code><b>内容哈希：</b></code> {{ evidenceHash }}</p
          >
          <p nz-paragraph
            ><code><b>交易哈希：</b></code> {{ transactionHash }}</p
          >
          <p nz-paragraph
            ><code><b>区块高度：</b></code> {{ blockNumber }}</p
          >
        </div> -->
      </div>
    </nz-result>
  `
})
export class ResultSuccessComponent {
  @Input() username?: string;
  @Input() evidenceID?: string;
  @Input() timestamp?: string;
  @Input() textData?: string;
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
