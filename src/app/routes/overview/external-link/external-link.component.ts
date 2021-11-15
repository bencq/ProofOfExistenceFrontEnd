import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-overview-external-link',
  templateUrl: './external-link.component.html'
})
export class OverviewExternalLinkComponent implements OnInit {
  constructor(private http: _HttpClient) {}

  ngOnInit(): void {
    window.open('http://172.18.197.76:5100/', '_blank');
  }
}
