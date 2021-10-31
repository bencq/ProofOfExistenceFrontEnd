import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-overview-direct',
  templateUrl: './direct.component.html'
})
export class OverviewDirectComponent implements OnInit {
  webSite!: any[];
  blockNumber: Number = NaN;
  transactionCount: Number = NaN;
  nodeCount: Number = NaN;

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    console.log('refresh');
    this.http
      .post('exportedAPI/rpc', {
        apiName: 'getTotalTransactionCount'
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.blockNumber = res.data.blockNumber;
        this.transactionCount = res.data.transactionCount;
        this.cdr.detectChanges();
      });
    this.http
      .post('exportedAPI/rpc', {
        apiName: 'getPeers'
      })
      .pipe()
      .subscribe(res => {
        console.log(res);
        this.nodeCount = res.data.peers.length + 1;
        this.cdr.detectChanges();
      });
    this.http.get('/chart').subscribe(res => {
      this.webSite = res.visitData.slice(0, 10);
      this.cdr.detectChanges();
    });
  }
}
