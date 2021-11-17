import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-overview-external-link',
  templateUrl: './external-link.component.html'
})
export class OverviewExternalLinkComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('place holder');
  }
}
