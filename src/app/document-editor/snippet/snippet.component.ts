import {
  Component, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy, AfterViewChecked
} from '@angular/core';
import { TextType } from '../../data-models/text-type';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'ency-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component..scss']
})
export class SnippetComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() textType: TextType;
  @Output() textTypeChange: EventEmitter<TextType> = new EventEmitter();
  @Input()  content: string;
  @Output() contentChange = new EventEmitter<string>();
  _selId: number; // ID-ul acestui snippet in cadrul serviciului de selectie
  @Output() selId:  EventEmitter<number> = new EventEmitter();
  // selection poate fi false sau o lista [start, end] care sa precizeze
  // selectia ce va fi aplicata dupa ce se randeaza view-ul
  @Input() selection: any = false;
  @Output() stylingRemoved = new EventEmitter();


  constructor(private element: ElementRef, private selServ: SelectionService) {
    // console.log(this.el.nativeElement);
  }

  ngOnInit() {
    const node = this.element.nativeElement.querySelector('.content_span');
    this._selId = this.selServ.addSnippetSpan(node);
    this.selId.emit(this._selId);
  }

  ngOnDestroy() {
    this.selServ.removeSnippetSpan(this._selId);
  }

  ngAfterViewChecked() {
    if (this.selection !== false) {
      this.selServ.select(this._selId, this.selection[0], this.selection[1]);
      this.selection = false;
    }
  }

  updateContent(event) {
    // Scotem zero-width whitespace-ul daupa ce s-a tasta ceva fiindca produce
    // comportamente dubioase daca e lasat acolo
    let content = event.target.innerText;
    if (content.replace('\u200B', '').trim() !== '') {
      content = content.replace('\u200B', '');
      const sel = this.selServ.getSelection();
      this.selection = [sel.startOffset, sel.endOffset];
    }
    this.contentChange.emit(content);
  }

  moveCursorOnTyping(event) {
    // Ma ocup de taste la mana, ca comportamentul default ma incurca
    console.log(event.key);
    const sel = this.selServ.getSelection();
    if (event.key !== ' ' && event.key.length === 1) {
      if (event.getModifierState('Control')) {
        // Tasta control e apasata, lasam browser-ul sa faca ce stie
        return;
      }
      // Punem tastele la mana
      event.preventDefault();
      const c = this.content;
      this.contentChange.emit(c.slice(0, sel.startOffset) + event.key +
        c.slice(sel.endOffset) );
      this.selection = [sel.startOffset + 1, sel.startOffset + 1];
    }
    if (event.key.toLowerCase() === 'backspace') {
      event.preventDefault();
      // Nu facem nimic daca suntem deja la inceputul randului
      if (sel.startOffset !== 0) {
        const c = this.content;
        this.contentChange.emit(c.slice(0, sel.startOffset - 1) + c.slice(sel.startOffset));
        this.selection = [sel.startOffset - 1, sel.startOffset - 1];
      }
    }
  }
}
