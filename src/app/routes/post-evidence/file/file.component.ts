import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService, _HttpClient } from '@delon/theme';
import { copy } from '@delon/util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

import { ResultErrorComponent, ResultSuccessComponent } from '../direct/direct.component';

@Component({
  selector: 'app-post-evidence-file',
  templateUrl: './file.component.html',
  styles: [
    '::ng-deep .ant-upload {width: 100%}',
    '::ng-deep .ant-upload-list-text-container .ant-upload-list-item {font-size: large;}',
    '::ng-deep .ant-upload-list-item-info .ant-upload-text-icon .anticon {font-size: large;}',
    '::ng-deep .ant-btn-icon-only.ant-btn-sm > * {font-size: large;}'
  ]
})
export class PostEvidenceFileComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private settings: SettingsService,
    private msg: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      evidenceName: [null, [Validators.pattern(/^\S{0,16}$/)]]
    });
  }

  form!: FormGroup;
  uploading = false;
  fileList: NzUploadFile[] = [];

  readonly evidenceNameMaxChar = 16;
  readonly maxFileSize = 1024 * 1024 * 1024; //KB
  get evidenceName(): AbstractControl {
    return this.form.controls.evidenceName;
  }

  // evidenceValidator = (control: FormControl): { [s: string]: boolean } => {
  //   console.log(this);
  //   return {};
  // };

  onUploadChange(p: NzUploadChangeParam): void {
    console.log(p.event?.percent);
  }

  onCopy(v?: string): void {
    if (v) {
      copy(v);
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.size! > this.maxFileSize) {
      this.msg.error(`所选择的文件大小为${file.size}Bytes, 超过文件最大大小限制${this.maxFileSize}Bytes！`);
    } else {
      this.fileList = [file];
    }
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    formData.set('apiName', 'postEvidence');
    formData.set('evidenceType', 'file');
    formData.set('evidenceName', this.evidenceName.value);
    this.fileList.forEach((file: any) => {
      formData.append('upload_file', file);
    });

    // console.log(formData.getAll('files[]'), formData.get('apiName'));

    this.uploading = true;

    // You can use any AJAX library you like
    this.http
      .post('exportedAPI/v1', formData)
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.uploading = false;
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
