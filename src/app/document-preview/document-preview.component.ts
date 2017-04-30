import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
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
  deleteConfirmationVisible = 0;
  editing = 0;
  DocServ;
  constructor(private docServ: DocumentProviderService) {
    this.DocServ = docServ;
  }

  ngOnInit() {
  }
  removeSelectedDoc() {
    // Scot documentul la care suntem
    this.deleteConfirmationVisible = 0;
    this.docServ.documents.splice(this.selectedDocIndex, 1);
    this.selectedDocIndexChange.emit(-1);
  }
  @HostListener('document:click', ['$event']) onOutsideClick(event) {
    // Inchidem fereastra de preview cand user-ul face click in afara ei
    // console.log(event.target.className);
    // Totusi, cand editam un document, este prea usor sa se inchida fereastra
    // deci fa o exceptie pentru cazul ala
    if (event.target.className === 'modal-overlay' && this.editing === 0) {
      this.selectedDocIndexChange.emit(-1);
    }
  }
}
