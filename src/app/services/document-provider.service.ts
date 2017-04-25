import { Injectable } from '@angular/core';
import { Document } from '../data-models/document';

@Injectable()
export class DocumentProviderService {
  documents: Document[] = [
    {snippets: [
      {textType: 'bold_text', content: 'What is up bitch-ass nigga', id: -1, selection: false},
      {textType: 'plain_text', content: 'Vand caii pe 2000 de lei bucata', id: -1, selection: false},
      {textType: 'plain_text', content: 'Onii-chan watashi no daisuki...', id: -1, selection: false},
      {textType: 'italic_text', content: 'Te sui ca gaina in varful gramezii si strigi cucurigu', id: -1, selection: false},
      {textType: 'plain_text', content: 'Ma-ta plange cand o bat, mie mi se pare amuzant', id: -1, selection: false}
    ], title: 'Demo1'},
    {snippets: [
      {textType: 'bold_text', content: 'Salut', id: -1, selection: false}
    ], title: 'Yeah'}
  ];
  constructor() { }

}
