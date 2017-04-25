import {Component, ElementRef, Input, OnInit} from '@angular/core';
import { SnippetModel } from '../data-models/snippet-model';
import {SelectionService} from '../services/selection.service';
import {TextType} from '../data-models/text-type';

@Component({
  selector: 'ency-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  console;
  ss;
  ss2;
  @Input() doc; // Documentul de intrare cu care lucram

  static newSnippData(textType: TextType, content: string, selectOnCreate?): SnippetModel {
    let soc = false;
    if (selectOnCreate) {
      soc = selectOnCreate;
    }
    return {textType: textType, content: content, id: -1, selection: soc};
  }

  constructor(private el: ElementRef, private selServ: SelectionService) {
    this.console = window.console;
    this.ss = SelectionService;
    this.ss2 = this.selServ;
  }

  ngOnInit() {
    this.concatPlainTextSnipps();
  }
  onEmptyClick(event) {
    const sel = this.selServ.getSelection();
    console.log('Hey ', sel);
    console.log('event.target.classname: ', event.target.className)
    const emptySnip: SnippetModel = {textType: 'plain_text', content: '\u200B', id: -1, selection: [0, 0]};
    if (event.target.className.trim() === 'ency-editor' && sel.startId === undefined) {
      // Daca nu-s snippeturi il punem pe ala gol si am terminat
      if (this.doc.snippets.length === 0) {
        this.doc.snippets.push(emptySnip);
        return;
      }
      // Am ajuns, aici, inseamna ca sunt, vedem de care
      const lastSnip = this.doc.snippets[this.doc.snippets.length - 1];
      if (lastSnip.textType !== 'plain_text') {
        // Daca nu-i de tip text, facem adaugam noi unul
        this.doc.snippets.push(emptySnip);
        return;
      } else {
        // Este de tip text, pun cursorul la sfarsitul sau
        const cursPos = lastSnip.content.length;
        this.selServ.select(lastSnip.id, cursPos, cursPos);
      }
    }
    console.log(this.doc.snippets)
  }
  snippetFromSelection(textType: TextType) {
    const sel = this.selServ.getSelection();
    if (sel.startOffset > sel.endOffset) {
      // Userul a factu selectia de la dreapta la stanga
      // Codul acestei functiis se bazeaza pe startOffset < endOffset deci le inversez
      [sel.startOffset, sel.endOffset] = [sel.endOffset, sel.startOffset];
    }
    console.log('O sa facen un nou snippet');
    console.log(sel);
    if (sel.startId === sel.endId && sel.startId !== undefined && sel.startOffset !== sel.endOffset) {
      // Suntem in acelasi snippet
      let index; // Indexului snippetului  cu care lucram
      for (let i = 0; i < this.doc.snippets.length; i++) {
        //console.log('Se compara ' + this.doc.snippets[i].id + ' cu ' + sel.startId);
        if (this.doc.snippets[i].id == sel.startId) {
          index = i;
          break;
        }
      }
      //console.log('startId: ' + sel.startId + ' endId: ' + sel.endId);
      //console.log('starOffset: ' + sel.startOffset + ' endOffset: ' + sel.endOffset);
      //console.log('index: ' + index);
      // Continutul noului snippet
      const stylecont = this.doc.snippets[index].content.slice(sel.startOffset, sel.endOffset);
      const selSnippCont = this.doc.snippets[index].content;
      // Il scoatem din snippet-ul original
      // cont.slice(0, sel.startOffset) + cont.slice(sel.endOffset);
      this.doc.snippets = [].concat(
        this.doc.snippets.slice(0, index),
        [EditorComponent.newSnippData('plain_text', selSnippCont.slice(0, sel.startOffset))],
        [EditorComponent.newSnippData(textType, stylecont)],
        [EditorComponent.newSnippData('plain_text', selSnippCont.slice(sel.endOffset))],
        this.doc.snippets.slice(index + 1)
      );

    }
  }

  concatPlainTextSnipps() {
    // Uneste snippet-urile plain text adiacente
    const new_snippets: SnippetModel[] = [];
    for (let i = 0; i < this.doc.snippets.length; i++) {
      if (i === 0) {
        new_snippets.push(this.doc.snippets[0]);
        continue;
      }
      if (new_snippets[new_snippets.length - 1].textType === 'plain_text' && this.doc.snippets[i].textType === 'plain_text') {
        const snip = new_snippets.pop();
        new_snippets.push(
          EditorComponent.newSnippData('plain_text',
          snip.content + this.doc.snippets[i].content)
        );
      } else {
        new_snippets.push(this.doc.snippets[i]);
      }
    }
    this.doc.snippets = new_snippets;
  }
  handleEnter(event) {
    //Cand dau ENTER intr-un snippet se duce cursorul las inceputul
    //Textului, este datoria mea sa rezolv asta
    /*console.log('Tasta apasata:');
    console.log('#', event.key, '#');*/
    if (event.key === 'Enter') {
      //Dezactivam comportamentul default al Enterului si il emulez eu cum trebuie
      event.preventDefault();
      const sel = this.selServ.getSelection();
      //const pos = SelectionService.getCursorPos();
      //this.contentChange.emit(this.content.slice(0, pos) + '\n\n' + this.content.slice(pos));
      //Folosesc mecanismul de selectie unica ca sa pun cursorul unde trebuie la update-ul view-ului
      let snip_index;
      for (let i = 0; i < this.doc.snippets.length; i++) {
        if (this.doc.snippets[i].id == sel.startId) {
          snip_index = i;
          break
        }
      }
      //Am gasit indexul snipetului selectat in lista de snippeturi
      //Caracterul de linie noua variaza. depinzand daca suntem la ultimul snipet in utlimul caracter sau nu
      let linebreak = '\n';
      let pos = sel.startOffset + 1;
      if (snip_index === this.doc.snippets.length - 1 && sel.startOffset === this.doc.snippets[snip_index].content.length) {
        linebreak = '\n\n';
        pos++;
      }
      const cont = this.doc.snippets[snip_index].content;
      this.doc.snippets[snip_index].content = cont.slice(0, sel.startOffset) + linebreak + cont.slice(sel.startOffset);
      this.doc.snippets[snip_index].selection = [pos, pos];
    }
  }
}
