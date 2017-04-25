import { Component, OnInit } from '@angular/core';
import { DocumentProviderService } from '../services/document-provider.service';
import { Document } from '../data-models/document';

@Component({
  selector: 'ency-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  DocServ;
  constructor(private docServ: DocumentProviderService) {
    this.DocServ = docServ;
  }

  ngOnInit() {
  }
  newDocument() {
    // Prima data gasin un nume de tipul Untitled n pentru document
    let n = 1;
    while (1) {
      let title_used = false; // Titlul e neutilizat pana la proba contrarie
      var title = 'Untitled ' + n.toString();
      for (let doc of this.docServ.documents) {
        if (doc.title === title) {
          title_used = true;
          break;
        }
      }
      if (! title_used) {
        // Am gasit titlu, iesim din while
        break;
      } else {
        // Titlul e folosit, crestem n
        n++;
      }
    }
    const emptyDoc: Document = {title: title, snippets: []};
    this.docServ.documents.push(emptyDoc);
  }
}
