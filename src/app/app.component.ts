import {Component, HostListener} from '@angular/core';
import { DocumentProviderService } from './services/document-provider.service';
import * as FileSaver from 'file-saver';
import { Document } from './data-models/document';

@Component({
  selector: 'ency-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  options_menu_displayed = 0;
  DocServ: DocumentProviderService;
  constructor(private docServ: DocumentProviderService) {
    this.DocServ = docServ;
  }
  @HostListener('document:click', ['$event']) onGlobalClick(event) {
    // Dau toggle la dropdown cand dau click pe more_button,
    // Nu fac nimic cand apas pe una din optiuni
    // Il inchid cand apas in alta parte

    if (event.target.parentElement === null) {
      // Cu siguranta am facut click pe altceva
      this.options_menu_displayed = 0;
      return;
    }
    if (event.target.parentElement.className === 'more_button') {
      // Am facut click pe butonul ..., dam toggle
      this.options_menu_displayed = (this.options_menu_displayed + 1) % 2;
    } else if (event.target.parentElement.className.indexOf('dropdown-content') !== -1) {
      // Nu fac nimic :)
      return;
    } else {
      this.options_menu_displayed = 0;
    }
  }
  exportJSON() {
    // Exporta toate documente ca un JSON ce va fi dat spre Download
    // Bag si data in numele fisierlui
    // id si selection nu-s proprietati neaparat relevante pentru salvare
    // dar oricum vor fi suprascrise la incarcare de va fi nevoie.
    const now = new Date();
    const content = JSON.stringify(this.docServ.documents);
    const filename = ['Documents', now.getDate(), now.getMonth() + 1,
      now.getFullYear()].join('_') + '.json';
    const file = new File([content], filename, {type: 'application/json;charset=utf-8'});
    FileSaver.saveAs(file);
    this.options_menu_displayed = 0;
  }
  importJSON(file) {
    // Importa un fisier ales de utilizator
    // Nu-i prea robusta sau rezistenta la erori, dar merge
    const read = new FileReader();
    read.readAsText(file);
    read.onloadend = () => {
      console.log(read.result);
      // this.docServ.documents = JSON.parse(read.result);
      try {
        const data_struct = JSON.parse(read.result);
        this.docServ.documents = data_struct;
      } catch (SyntaxError) {
        console.log('Invalid JSON!');
      }
    };
  }
}
