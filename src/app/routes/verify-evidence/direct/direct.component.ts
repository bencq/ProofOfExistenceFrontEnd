import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-verify-evidence-direct',
  templateUrl: './direct.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEvidenceDirectComponent implements OnInit {
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
        apiName: 'verifyEvidence',
        username: this.username.value,
        keyStorePassword: '123456',
        keyPassword: '123456',
        evidenceAddress: this.textData.value.trim()
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.submitting = false;
        this.cdr.detectChanges();
        if (res.status !== 0) {
          this.modal.create({
            nzTitle: '验证结果',
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
            nzTitle: '验证结果',
            nzContent: ResultSuccessComponent,
            nzCentered: true,
            nzComponentParams: {
              success: res.data.success
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
    <nz-result nzStatus="success" nzTitle="验证通过" nzSubTitle="验证数据为上链用户之前上链的数据，完全一致。">
      <div nz-result-content>
        <div class="desc">
          <p nz-paragraph
            ><code><b>成功：</b></code> {{ success }}</p
          >
        </div>
      </div>
    </nz-result>
  `
})
export class ResultSuccessComponent {
  @Input() success?: string;
}

@Component({
  selector: 'app-result-error',
  template: `
    <nz-result nzStatus="error" nzTitle="验证不通过" nzSubTitle="验证数据不是用户之前上链过的数据。">
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
