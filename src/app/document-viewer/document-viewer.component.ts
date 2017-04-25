import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../data-models/document';

@Component({
  selector: 'ency-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {

  @Input() doc: Document; // Documentul de randat
  constructor() { }

  ngOnInit() {
  }

}
