import { browser, element, by } from 'protractor';

export class EncyPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ency-root h1')).getText();
  }
}
