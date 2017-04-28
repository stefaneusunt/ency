import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EditorComponent } from './document-editor/editor.component';
import { MdIconComponent } from './md-icon/md-icon.component';
import { SnippetComponent } from './document-editor/snippet/snippet.component';
import { SelectionService } from './services/selection.service';
import { DocumentProviderService } from './services/document-provider.service';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';

const appRoutes: Routes  = [
  {path: 'document-list', component: DocumentListComponent},
  {path: '', redirectTo: '/document-list', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    MdIconComponent,
    SnippetComponent,
    DocumentViewerComponent,
    DocumentListComponent,
    DocumentPreviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    SelectionService,
    DocumentProviderService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
