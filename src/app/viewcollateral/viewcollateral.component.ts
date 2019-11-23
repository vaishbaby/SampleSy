import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSharedService } from '../shared/services/shared.service';
import { ViewCollateralService } from './viewcollateral.service';
import { downloadFile } from '../shared/utils/app.utils';
import * as _ from 'lodash';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { Entitlement } from '../shared/utils/entitlement';

class TagsUIModel {
  tagId: number = null;
  tagName: string;
  tagCount: number = null;
  tagColor: string;
}

@Component({
  selector: 'app-viewcollateral',
  templateUrl: './viewcollateral.component.html',
  styleUrls: ['./viewcollateral.component.scss'],
  providers: [ViewCollateralService,Entitlement]
})
export class ViewcollateralComponent implements OnInit, OnDestroy, AfterViewInit {

  tags: TagsUIModel[] = [];
  texts: string[];
  results: string[];
  collateralId: number;
  tagColor: any;
  routeData: any;
  htmlCode:any = '';
  file: any;
  fileName: string = "";
  fileUrl;
  showTagError = false;
  newTag: string = '';
  iframeRef=null;
  blobData=null;

  constructor(private acr: ActivatedRoute,
    private router: Router,
    private domSan: DomSanitizer,
    private spinnerService: SpinnerService,
    private viewCollateralService: ViewCollateralService,
    private appSharedService: AppSharedService,  
    public entitlement:Entitlement) { }

  @HostListener('document:keyup.escape', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.goBack()
  }

  ngOnInit() {
    this.routeData = this.appSharedService.getRouteData();
    this.collateralId = this.routeData.collateralObj.collateralId;
    this.fileName = this.routeData.collateralObj.fileName;
    this.getConvertedHtmlFile(this.collateralId);
    this.getTagsByCollateral();

  }

  ngAfterViewInit() {

  }

  onDeleteTag(tag) {
    let tagIndex = this.tags.findIndex(t => t.tagId == tag.tagId);
    if (tagIndex !== null && tagIndex !== undefined && tagIndex >= 0) {
      this.tags.splice(tagIndex, 1);
    }
  }
  // To get all tags saved against that file
  getTagsByCollateral() {
    this.viewCollateralService.getTagsByCollateral(this.collateralId).subscribe((data: any) => {
      this.displayAllTags(data);
    });
  }

  displayAllTags(data) {
    let tags: TagsUIModel[] = [];
    tags = _.map(data, (model) => {
      const tagsModel: TagsUIModel = _.omit(model, 'collateralId');
      if (tagsModel.tagColor) {
        tagsModel.tagColor = tagsModel.tagColor;
      } else {
        tagsModel.tagColor = '#f8e52d';
      }
      console.log("tagsModel after save call ", tagsModel);

      return tagsModel;
    });
    this.tags = tags;
  }
  //  To add tags related with that file
  addAnnotation(newAnnotation: string) {
    if (newAnnotation) {
      let tagIndex = this.tags.findIndex(t => t.tagName.toLowerCase() == newAnnotation.toLowerCase());
      if (tagIndex !== null && tagIndex !== undefined && tagIndex >= 0) {
        console.log("this tag is already exist.");
        this.showTagError = true;
      } else {
        this.newTag = '';
        const tagsModel = new TagsUIModel();
        tagsModel.tagName = newAnnotation;
        tagsModel.tagColor = this.getRandomColor();
        this.tags.push(tagsModel);
      }
    }
  }
  // To give random color to each tag
  getRandomColor() {
    var color = (function lol(m, s, c) {
      return s[m.floor(m.random() * s.length)] +
        (c && lol(m, s, c - 1));
    })(Math, '6789ABCDEF', 4);
    return '#' + color;
  }
  // For saving all added tags
  saveTags() {

    let requestData = {
      collateralId: this.collateralId,
      listOfTags: this.tags,
      tagColor: this.tagColor
    };
    this.viewCollateralService.saveTag(requestData).subscribe((data: any) => {

      if (data) {
        this.displayAllTags(data);
        // this.getTagsByCollateral();
      }
    }, (error) => {
    });

  }
  goBack() {
    this.appSharedService.setViewCollateralCloseEvent(true);
    this.router.navigate([{ outlets: { dialogs: null } }], { relativeTo: this.acr.parent });
  }
  public getConvertedHtmlFile(id: number) {
    // this.viewCollateralService.readHtmlConvertedFile(id).subscribe((data: any) => {
    //   this.htmlCode = this.domSan.bypassSecurityTrustHtml(data.docContent.toString());
    // })

    this.spinnerService.spinner(true);
    let downloadObj = {
      "fileName": this.fileName,
    }
    this.viewCollateralService.downloadFile(downloadObj).subscribe((data: any) => {
      this.blobData = data;
      const blob = new Blob([data], { type: 'application/pdf' });
      // this.htmlCode = this.domSan.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      // this.htmlCode = this.domSan.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      setTimeout(() => {
        this.htmlCode = URL.createObjectURL(blob);
      }, 100);
    });
  }
  downloadCollateral() {
    let downloadObj = {
      "fileName": this.fileName,
    }
    this.viewCollateralService.downloadFile(downloadObj).subscribe((data: any) => {

      downloadFile(data, this.fileName, 'application/octet-stream');

    })
  }
  onAfterLoadComplete(event){
    setTimeout(() => {
      this.spinnerService.spinner(false);
    }, 500);
  }
  onPdfLoad(event) {
    console.log("onPdfLoad");
    let ifr: any = document.getElementById("iFrameRef");
    if (ifr && ifr.contentDocument && ifr.contentDocument.readyState === 'complete' && ifr.contentDocument.embeds && ifr.contentDocument.embeds.length > 0) {      
      setTimeout(() => {
        this.spinnerService.spinner(false);
      }, 500);
      this.iframeRef = ifr;
      ifr.contentDocument.addEventListener('click', (e)=>{
        console.log("inside Iframe", e);
      });
      ifr.contentDocument.addEventListener('mouseup', (e)=>{
        console.log("inside Iframe", e);
      });
      ifr.contentDocument.addEventListener('mousedown', (e)=>{
        console.log("inside Iframe", e);
      });
      // for printing
      // ifr.focus();
      // ifr.contentWindow.print();
      return;
    }
  }
  onIframeFocus(){
    let ifr: any = document.getElementById("iFrameRef");
    console.log(ifr.contentDocument);
    document.getElementById('foo').focus();     
  }
  ngOnDestroy() {
    this.appSharedService.clearRouteData();
    this.blobData = null;
  }

}
