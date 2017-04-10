import { EncyPage } from './app.po';

describe('ency App', () => {
  let page: EncyPage;

  beforeEach(() => {
    page = new EncyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ency works!');
  });
});
