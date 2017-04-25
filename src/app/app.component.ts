import { Component } from '@angular/core';
import { DocumentProviderService } from './services/document-provider.service'

@Component({
  selector: 'ency-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options_menu_displayed = 1;
  DocServ: DocumentProviderService;
  constructor(private docServ: DocumentProviderService) {
    this.DocServ = docServ;
  }
  hideDropdownOnOutsideClick(event, dd) {
    console.log(event.target.parentElement);
    console.log(dd);
    if (event.target.parentElement != dd) {
      this.options_menu_displayed = 1;
    }
  }
}
