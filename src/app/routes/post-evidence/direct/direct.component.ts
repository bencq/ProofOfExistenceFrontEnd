import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService, _HttpClient } from '@delon/theme';
import { copy } from '@delon/util/browser';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-post-evidence-direct',
  templateUrl: './direct.component.html',
  // styles: ['::ng-deep label.mLabel {font-size: medium}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostEvidenceDirectComponent implements OnInit {
  form!: FormGroup;
  submitting: boolean = false;
  isLoading: boolean = true;
  // optionList: string[] = [];

  readonly evidenceNameMaxChar = 16;

  constructor(
    private fb: FormBuilder,
    private settings: SettingsService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      evidenceData: [null, [Validators.required]],
      // evidenceNameChecked: [false, [Validators.required]],
      evidenceName: [null, [Validators.pattern(/^\S{0,16}$/)]]
    });
    // this.optionList.push(this.settings.user.username!);
  }

  get evidenceData(): AbstractControl {
    return this.form.controls.evidenceData;
  }

  get evidenceName(): AbstractControl {
    return this.form.controls.evidenceName;
  }

  // get username(): AbstractControl {
  //   return this.form.controls.username;
  // }

  onCopy(v?: string): void {
    if (v) {
      copy(v);
    }
  }

  submit(): void {
    // console.log(this.username, this.evidenceData);
    this.submitting = true;
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
      console.log(key, this.form.controls[key].value);
    });
    if (this.form.invalid) {
      this.submitting = false;
      this.cdr.detectChanges();
      return;
    }
    this.http
      .post('exportedAPI/v1', {
        apiName: 'postEvidence',
        // username: this.username.value,
        evidenceName: this.evidenceName.value,
        evidenceData: this.evidenceData.value,
        evidenceType: 'text'
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.submitting = false;
        this.cdr.detectChanges();
        if (res.status !== 0) {
          this.modal.error({
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
          this.modal.success({
            nzTitle: '上链结果',
            nzContent: ResultSuccessComponent,
            nzCentered: true,
            nzComponentParams: {
              username: this.settings.user.username,
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
              evidenceName: this.evidenceName.value,
              evidenceID: res.data.evidenceID,
              newEvidenceAddress: res.data.newEvidenceAddress,
              // evidenceData: this.evidenceData.value,
              evidenceHash: res.data.evidenceHash,
              onCopy: this.onCopy
            },
            nzWidth: (1920 * 2) / 3,
            nzOnOk: () => {
              console.log('ok');
            }
          });
        }
      });
  }
}

@Component({
  selector: 'app-result-success',
  template: `
    <nz-result nzStatus="success" nzTitle="上链成功" nzSubTitle="数据将在永久保存在区块链上，不可篡改。">
      <div nz-result-content>
        <nz-descriptions nzTitle="存证信息" nzBordered [nzColumn]="1">
          <nz-descriptions-item nzTitle="存证用户">
            {{ username }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证时间">{{ timestamp }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="区块高度">{{ blockNumber }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="交易哈希">
            {{ transactionHash }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证名称">
            <nz-row [nzGutter]="0">
              <nz-col [nzSpan]="20">
                <b style="color: 'red'">{{ evidenceName }}</b>
              </nz-col>
              <nz-col [nzSpan]="2"> </nz-col>
              <nz-col [nzSpan]="2" style="text-align:right">
                <a nz-tooltip nzTooltipTitle="点击复制到剪切板" (click)="onCopy(evidenceName)" *ngIf="evidenceName">复制</a>
              </nz-col>
            </nz-row>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证ID">
            <nz-row [nzGutter]="0">
              <nz-col [nzSpan]="20">
                <b style="color: 'red'">{{ evidenceID }}</b>
              </nz-col>
              <nz-col [nzSpan]="2"> </nz-col>
              <nz-col [nzSpan]="2" style="text-align:right">
                <a nz-tooltip nzTooltipTitle="点击复制到剪切板" (click)="onCopy(evidenceID)">复制</a>
              </nz-col>
            </nz-row>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="存证地址：">
            <nz-row [nzGutter]="0">
              <nz-col [nzSpan]="20">
                <a
                  nz-tooltip
                  nzTooltipTitle="点击跳转至存证浏览器查看该存证"
                  [href]="'/#/explore-evidence/direct/' + newEvidenceAddress"
                  target="_blank"
                >
                  <b>
                    {{ newEvidenceAddress }}
                  </b>
                </a>
              </nz-col>
              <nz-col [nzSpan]="2"> </nz-col>
              <nz-col [nzSpan]="2" style="text-align:right">
                <a nz-tooltip nzTooltipTitle="点击复制到剪切板" (click)="onCopy(newEvidenceAddress)">复制</a>
              </nz-col>
            </nz-row>
          </nz-descriptions-item>
          <!-- <nz-descriptions-item nzTitle="存证内容">{{ evidenceData }}</nz-descriptions-item> -->
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
  @Input() evidenceName?: string;
  @Input() evidenceID?: string;
  @Input() newEvidenceAddress?: string;
  // @Input() evidenceData?: string;
  @Input() evidenceHash?: string;

  @Input() onCopy!: (v?: string) => void;
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
