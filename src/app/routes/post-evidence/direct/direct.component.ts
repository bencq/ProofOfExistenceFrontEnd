import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-post-evidence-direct',
  templateUrl: './direct.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostEvidenceDirectComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  isLoading = true;
  optionList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private settings: SettingsService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      textData: [null, [Validators.required]],
      username: [null, [Validators.required]]
    });
    this.optionList.push(this.settings.user.username!);
  }

  get textData(): AbstractControl {
    return this.form.controls.textData;
  }

  get username(): AbstractControl {
    return this.form.controls.username;
  }

  submit(): void {
    console.log(this.username, this.textData);
    this.submitting = true;
    this.http
      .post('exportedAPI/v1', {
        apiName: 'postEvidence',
        username: this.username.value,
        textData: this.textData.value
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.submitting = false;
        this.cdr.detectChanges();
        if (res.status !== 0) {
          this.modal.create({
            nzTitle: '上链结果',
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
            nzTitle: '上链结果',
            nzContent: ResultSuccessComponent,
            nzCentered: true,
            nzComponentParams: {
              username: this.username.value,
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
              blockNumber: res.data.blockNumber,
              transactionHash: res.data.transactionHash,
              evidenceID: res.data.evidenceID,
              newEvidenceAddress: res.data.newEvidenceAddress,
              textData: this.textData.value,
              evidenceHash: res.data.evidenceHash
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
    <nz-result nzStatus="success" nzTitle="上链成功" nzSubTitle="数据将在永久保存在区块链上，不可篡改。">
      <div nz-result-content>
        <nz-descriptions nzTitle="存证信息" nzBordered [nzColumn]="1">
          <nz-descriptions-item nzTitle="存证用户">{{ username }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证时间">{{ timestamp }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="区块高度">{{ blockNumber }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="交易哈希">{{ transactionHash }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证ID">{{ evidenceID }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证地址：">{{ newEvidenceAddress }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证内容">{{ textData }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="内容哈希"> {{ evidenceHash }} </nz-descriptions-item>
        </nz-descriptions>
      </div>
    </nz-result>
  `
})
export class ResultSuccessComponent {
  @Input() username?: string;
  @Input() timestamp?: string;
  @Input() blockNumber?: number;
  @Input() transactionHash?: string;
  @Input() evidenceID?: string;
  @Input() newEvidenceAddress?: string;
  @Input() textData?: string;
  @Input() evidenceHash?: string;
}

@Component({
  selector: 'app-result-error',
  template: `
    <nz-result nzStatus="error" nzTitle="上链失败" nzSubTitle="失败原因见错误信息，如有问题请联系技术人员。">
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
