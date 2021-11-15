import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService, _HttpClient } from '@delon/theme';
import { copy } from '@delon/util';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ResultErrorComponent, ResultSuccessComponent } from '../direct/direct.component';

@Component({
  selector: 'app-post-evidence-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styles: [
    `
      .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
      }

      .dynamic-delete-button:hover {
        color: red;
      }

      .item-input {
        width: 80%;
        margin-right: 8px;
      }

      .add-button {
        width: 100%;
      }
    `
  ]
})
export class PostEvidenceDynamicFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private settings: SettingsService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      evidenceName: [null, [Validators.pattern(/^\S{0,16}$/)]]
    });
    this.addField();
  }

  readonly evidenceNameMaxChar = 16;

  form!: FormGroup;
  listOfControl: Array<{ id: number; itemKey: string; itemValue: string }> = [];
  submitting = false;
  onCopy(v?: string): void {
    if (v) {
      copy(v);
    }
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      itemKey: `itemKey${id}`,
      itemValue: `itemValue${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.form.addControl(this.listOfControl[index - 1].itemKey, new FormControl(null, Validators.required));
    this.form.addControl(this.listOfControl[index - 1].itemValue, new FormControl(null, Validators.required));
  }

  removeField(i: { id: number; itemKey: string; itemValue: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.form.removeControl(i.itemKey);
      this.form.removeControl(i.itemValue);
    }
  }

  submitForm(): void {
    this.submitting = true;

    let object_dynamicForm: { [key: string]: string } = {};
    for (let ctrl of this.listOfControl) {
      if (ctrl.itemKey in this.form.controls && ctrl.itemValue in this.form.controls) {
        let keyControl = this.form.controls[ctrl.itemKey];
        let valueControl = this.form.controls[ctrl.itemValue];
        keyControl.markAsDirty();
        valueControl.markAsDirty();
        keyControl.updateValueAndValidity();
        valueControl.updateValueAndValidity();
        if (keyControl.valid && valueControl.valid) {
          object_dynamicForm[keyControl.value] = valueControl.value;
        }
      }
    }

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
        evidenceData: (() => {
          return JSON.stringify(object_dynamicForm);
        })(),
        evidenceType: 'json'
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

  get evidenceName(): AbstractControl {
    return this.form.controls.evidenceName;
  }

  evidenceNameCheckboxChanged(ra: any) {
    this.evidenceName.markAsDirty();
    this.evidenceName.updateValueAndValidity();
  }
}
