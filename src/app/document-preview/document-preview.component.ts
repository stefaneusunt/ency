import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Document } from '../data-models/document';
import { DocumentProviderService } from '../services/document-provider.service';

@Component({
  selector: 'ency-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {
  @Input() selectedDocIndex: number;
  @Output() selectedDocIndexChange: EventEmitter<number> = new EventEmitter();
  @Input() doc: Document;
  console;
  deleteConfirmationVisible = 0;
  constructor(private docServ: DocumentProviderService) {
    this.console = window.console;
  }

  ngOnInit() {
  }
  removeSelectedDoc() {
    //Scot documentul la care suntem
    this.deleteConfirmationVisible = 0;
    this.docServ.documents.splice(this.selectedDocIndex, 1);
    this.selectedDocIndexChange.emit(-1);
  }
}
