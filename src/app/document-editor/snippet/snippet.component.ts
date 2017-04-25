import {
  Component, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy, AfterViewInit, AfterViewChecked,
  AfterContentChecked
} from '@angular/core';
import { TextType } from '../../data-models/text-type';
import { SelectionService } from '../../services/selection.service';
import {EditorSelection} from "../editor-selection";

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

  emulateSpaceKey(event) {
    if (event.key === ' ') {
      //Introducem un no break space la pozitia cursorului si actualizam cursorul
      // Aparent cand se schimba continutul (componenta -> view) cursorul este
      // mutat la inceput, eu trebuie sa contracarez asta
      event.preventDefault();
      const c = this.content;
      const sel = this.selServ.getSelection();
      this.contentChange.emit(c.slice(0, sel.startOffset) + '\u2004' + c.slice(sel.startOffset));
      this.selection = [sel.startOffset + 1, sel.startOffset + 1];
    }
  }
}
