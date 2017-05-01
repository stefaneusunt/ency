import { Injectable } from '@angular/core';
import { Document } from '../data-models/document';
import { startingDocsJSON } from '../starting-docs';

@Injectable()
export class DocumentProviderService {
  documents: Document[] = JSON.parse(startingDocsJSON);
  constructor() {
    this.restoreFromLocalStorage();
  }
  saveToLocalStorage() {
    localStorage.setItem('documents', JSON.stringify(this.documents));
  }
  restoreFromLocalStorage() {
    const json = localStorage.getItem('documents');
    if (json !== null) {
      this.documents = JSON.parse(json);
    }
  }
}
