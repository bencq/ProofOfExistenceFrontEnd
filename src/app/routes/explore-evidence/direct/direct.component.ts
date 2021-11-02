import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-explore-evidence-direct',
  templateUrl: './direct.component.html',
  styles: [
    '::ng-deep .ant-descriptions-item-label {width: 20%}',
    '::ng-deep .ant-skeleton-paragraph {margin-bottom: 0}',
    'div#square {border: solid; border-width: 1px; border-color: #00000010; margin: 4px;  background-color: #00000008 }'
  ]
})
export class ExploreEvidenceDirectComponent implements OnInit {
  constructor(private http: _HttpClient, private router: ActivatedRoute) {}

  username?: string;
  evidenceName?: string;
  evidenceID?: string;
  evidenceAddress?: string;
  timestamp?: string;
  evidenceHash?: string;
  transactionHash?: string;
  blockNumber?: string;
  textData?: string;

  loading: boolean = true;

  ngOnInit(): void {
    this.evidenceAddress = this.router.snapshot.params.evidenceAddress;
    console.log('evidenceAddress', this.evidenceAddress);
    this.http
      .post('exportedAPI/v1', {
        apiName: 'exploreEvidence',
        evidenceAddress: this.evidenceAddress
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        // this.cdr.detectChanges();
        if (res.status !== 0) {
          //
        } else {
          this.username = res.data.username;
          this.evidenceName = res.data.evidenceName;
          this.evidenceID = res.data.evidenceID;
          this.evidenceAddress = res.data.evidenceAddress;
          this.timestamp = (() => {
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
          })();
          this.evidenceHash = res.data.evidenceHash;
          this.transactionHash = res.data.transactionHash;
          this.blockNumber = res.data.blockNumber;
          this.textData = res.data.textData;

          this.loading = false;
        }
      });
  }
}
