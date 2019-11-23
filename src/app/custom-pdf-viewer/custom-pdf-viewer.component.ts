import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PDFSource, PDFProgressData, PDFDocumentProxy } from 'pdfjs-dist';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { watchScroll } from './utils';
import * as printJS from 'print-js';

@Component({
  selector: 'app-custom-pdf-viewer',
  templateUrl: './custom-pdf-viewer.component.html',
  styleUrls: ['./custom-pdf-viewer.component.scss']
})
export class CustomPdfViewerComponent {
  _src: string | PDFSource | ArrayBuffer = null;
  @Input('src')
  set src(value: string | PDFSource | ArrayBuffer) {
    if(value) {
      this._src = value;
    }
  }
  get src(): string | PDFSource | ArrayBuffer {
    return this._src;
  }

  @Input('filename') fileName: any = '';
  @Input('blobdata') blobData: any = '';
  @Output('after-load-complete') public onAfterLoadComplete = new EventEmitter<any>();
  iconFitScreen="/assets/images/icon_FullScreen.svg";

  error: any;
  page = 1;
  rotation = 0;
  zoom = 0.99;
  originalSize = false;
  pdf: any;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = false;
  pdfQuery = '';
  currentPageIndex = 0;
  pageFitFlag = false;


  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @ViewChild('pdfViewerRef') pdfViewerRef;

  constructor() { }
  /**
   * Set custom path to pdf worker
   */
  setCustomWorkerPath() {
    (<any>window).pdfWorkerSrc = '/lib/pdfjs-dist/build/pdf.worker.js';
  }

  onNumChange(event) {
    if(event && event.target && event.target.value) {
      this.page = event.target.value;
    }
  }

  onPrint(event){
    printJS(this.src as string);
    // printJS({printable:this.src as string, type:'pdf', showModal:true})
    // for printing
    // let ifr: any = document.getElementById("iFrameRef");
    // ifr.focus();
    // ifr.contentWindow.print();
  }

  onDownload(event){
    const blob = new Blob([this.blobData], {type:'application/octet-stream'});
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, this.fileName);
      return;
    }
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = this.src as string;
    tempLink.setAttribute('download', this.fileName);
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }

  onPageChange(event){
    // console.log("onPageChange :", event);
  }

  incrementPage(amount: number) {
    this.page += amount;
  }

  onZoom(amount: number){
    // this.zoom += amount;
    let tempScale = this.pdfComponent.pdfViewer.currentScale;
    tempScale += amount;
    this.pdfComponent.pdfViewer._setScale(tempScale);
    if (tempScale <= 0.1) {
      // this.zoom = 0.1;
      this.pdfComponent.pdfViewer._setScale(0.1);
    }
  }

  onPageFit(){
    this.pageFitFlag = !this.pageFitFlag;
    this.onScale(this.pageFitFlag);
  }
  onScale(flag){
    if(flag){
      this.iconFitScreen="/assets/images/icon_FitScreen.svg";
      this.pdfComponent.pdfViewer._setScale("page-fit");
    } else {
      this.iconFitScreen="/assets/images/icon_FullScreen.svg";
      this.pdfComponent.pdfViewer._setScale("page-width");
    }
  }
  

  rotate(angle: number) {
    this.rotation += angle;
    if (this.rotation >= 360){
      this.rotation = 0;
    }
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.src = e.target.result;
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  onScroll(event){
    this.pdfComponent.pdfViewer.scroll = watchScroll(this.pdfComponent.pdfViewerContainer, this.pdfComponent.pdfViewer._scrollUpdate.bind(this.pdfComponent.pdfViewer));
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;
    // this.loadOutline();
    this.pdfComponent.pdfViewer.eventBus.on('updateviewarea', (e)=>{
      // console.log('updateviewarea', e);
      this.currentPageIndex = e.location.pageNumber;
    });
    this.onAfterLoadComplete.next("load-complete");
  }
  
  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    // let newSrc;

    // if (this.pdfSrc instanceof ArrayBuffer) {
    //   newSrc = { data: this.pdfSrc };
    // } else if (typeof this.pdfSrc === 'string') {
    //   newSrc = { url: this.pdfSrc };
    // } else {
    //   newSrc = { ...this.pdfSrc };
    // }

    // newSrc.password = password;

    // this.pdfSrc = newSrc;
  }

  /**
   * Pdf loading progress callback
   * @param {PDFProgressData} progressData
   */
  onProgress(progressData: PDFProgressData) {
    // console.log(progressData);
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  // scrollToPage() {
  //   this.pdfComponent.pdfViewer.scrollPageIntoView({
  //     pageNumber: 3
  //   });
  // }
  scrollToPage(page: number) {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: page
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: any) {
    // console.log('(page-rendered)', e);
  }

  searchQueryChanged(newQuery: string) {
    // if (newQuery !== this.pdfQuery) {
    //   this.pdfQuery = newQuery;
    //   this.pdfComponent.pdfFindController.executeCommand('find', {
    //     query: this.pdfQuery,
    //     highlightAll: true
    //   });
    // } else {
    //   this.pdfComponent.pdfFindController.executeCommand('findagain', {
    //     query: this.pdfQuery,
    //     highlightAll: true
    //   });
    // }
  }
}
