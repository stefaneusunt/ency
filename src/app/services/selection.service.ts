import { Injectable } from '@angular/core';
import {EditorSelection} from '../document-editor/editor-selection';

@Injectable()
export class SelectionService {

  snippets_spans = {};
  free_id = 0;

  static mergeElementChilds(node: Element): Element {
    // Uneori din motive necunoscute se strica <pre>-ul si in loc sa aiba un singur textnode ca si copil
    // apar tot felul de br-uri si codul de selectie nu mai merge, asa ca le repar

    let newcont: string[] = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const nodename = node.childNodes[i].nodeName;
      if (nodename === '#text') {
        newcont.push(node.childNodes[i].nodeValue);
      }
      if (nodename === 'BR') {
        newcont.push('\n');
      }
    }
    if (node.childNodes[node.childNodes.length - 1].nodeName === 'BR') {
      newcont.push('');
    }
    node.innerHTML = '';
    const textnode = document.createTextNode(newcont.join(''));
    node.appendChild(textnode);
    return node;
  }

  static selectElement(element, start: number, end: number) {
    if (element == null) {
      console.log('WARNING: selectElement got a null node from somewhere!');
      return;
    }
    // IMPORTANT
    // Aparent eu nu selectez un span sau un pre, ci selectez
    // textnodul ce este copilul elementului
    const range = document.createRange();
    const sel = window.getSelection();
    let textnode;
    // console.log('Element de selectat: ');
    // console.log(element);
    // console.log('Copii:');
    // console.log(element.childNodes);
    if (element.childNodes.length === 1 && element.nodeName !== '#text') {
      // Cazul normal, un element cu un singur textnode in interior
      textnode = element.firstChild;
    }
    if (element.childNodes.length > 1) {
      textnode = SelectionService.mergeElementChilds(element).firstChild;
    }
    if (element.childNodes.length === 0 && element.nodeName !== '#text') {
      // Avem un element gol, fara un textnode adecvat, il punem noi
      // Un snippet "gol" trebuie sa contina un zero-width whitespace pentru a putea fi selectat
      textnode = document.createTextNode('\u200B');
      element.appendChild(textnode);
    }
    range.setStart(textnode, start);
    range.setEnd(textnode, end);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static getSelectionWithElement(): [any, any, number, number] {
    const sel = document.getSelection();
    return [sel.anchorNode, sel.focusNode, sel.anchorOffset, sel.focusOffset];
  }
  static getCursorPos(): number {
    return SelectionService.getSelectionWithElement()[2];
  }
  static setCursorPos(pos: number) {
    const sel = SelectionService.getSelectionWithElement();
    sel[2] = pos;
    sel[3] = pos;
    SelectionService.selectElement(sel[0], sel[2], sel[3]);
  }
  constructor() { }

  addSnippetSpan(span_node): number {
    this.snippets_spans[this.free_id] = span_node;
    this.free_id++;
    return this.free_id - 1;
  }

  removeSnippetSpan(id: number) {
    delete this.snippets_spans[id];
  }

  select(id: number, start: number, end: number) {
    SelectionService.selectElement(this.snippets_spans[id], start, end);
  }

  getSelection(): EditorSelection {
    // f -> [id, start, end]
    const _sel = SelectionService.getSelectionWithElement();
    console.log('_sel este ', _sel);
    if (_sel[0] === null) {
      return {startId: undefined, endId: undefined, startOffset: 0, endOffset: 0};
    }
    let startId, endId;
    for (const id in this.snippets_spans) {
      // console.log('snippets_span['+ id + '].firstChild', this.snippets_spans[id].firstChild);
      // console.log('sel[0] ', _sel[0]);
      if (this.snippets_spans[id].firstChild === _sel[0]) {
        startId = id;
      }
      if (this.snippets_spans[id].firstChild === _sel[1]) {
        endId = id;
      }
    }
    return {startId: startId, endId: endId, startOffset: _sel[2], endOffset: _sel[3]};
  }

}
