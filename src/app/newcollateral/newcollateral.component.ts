import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NewCollateralService } from './newcollateral.service';
import { AppSharedService } from '../shared/services/shared.service';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newcollateral',
  templateUrl: './newcollateral.component.html',
  styleUrls: ['./newcollateral.component.scss'],
  providers: [NewCollateralService]
})
export class NewcollateralComponent implements OnInit, OnDestroy, AfterViewInit {
  collateralForm: FormGroup;
  submitted = false;
  uploadedFiles: any = [];
  routeData: any;
  openType: string = '';
  collateralId: string = '';
  collateralObj: any = {collateralTypeUIModel:'', docName:''};
  suggestedCollateralTypes = [];
  collateralTypes = [];
  proposalName:any;
  proposalId: any;
  @ViewChild('documentNameRef') documentNameRef: any;

  constructor(private router: Router,
    private acr: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    private collateralService: NewCollateralService,
    private appSharedService: AppSharedService) { }


    @HostListener('document:keyup.escape', ['$event']) onKeyupHandler(event: KeyboardEvent) {
      this.close();
  }

  ngOnInit() {
    this.routeData = {...this.appSharedService.getRouteData()};
    this.openType = this.routeData.openType;
    if(this.openType == 'edit') {
      this.collateralId = this.routeData.index;
      this.collateralObj = {...this.routeData.collateralObj};
    } else if (this.openType == 'newFromPraposal') {
      this.proposalName = this.routeData.proposalName;
      this.proposalId = this.routeData.proposalId;
    }
    
    this.collateralForm = this.formBuilder.group({
      collateralTypeUIModel: new FormControl("", Validators.required),
      docName: new FormControl("", Validators.required),
      fileUpload: new FormControl(""),
    });

    this.collateralService.getAllCollateralTypes().subscribe((response: any)=>{
      this.collateralTypes = response;
    });
    if (this.collateralObj.fileName) {
      this.uploadedFiles=[];
      let fileItem: any = {};
      fileItem.fileName = this.collateralObj.fileName;
      fileItem.file = null;
      this.uploadedFiles.push(fileItem);
    }


  }
  ngAfterViewInit(){
    setTimeout(() => {
      if( this.documentNameRef &&  this.documentNameRef.nativeElement){
          this.documentNameRef.nativeElement.focus();
        }
    }, 100);
  }
  get f() { return this.collateralForm.controls; }

  search(event) {
    this.suggestedCollateralTypes = this.collateralTypes.filter((c) => {
      let collateralType: string = c.collateralType ? c.collateralType.toString().toLowerCase() : '';
      let query: string = event.query.toLowerCase();
      return collateralType.startsWith(query)
    });
  }
  onSubmit(form: any) {
    this.submitted = true;
    console.log(form.value);

    this.checkFileError();
    if (this.collateralForm.valid) {
      this.spinnerService.spinner(true);
      this.collateralService.saveCollateral(this.collateralService.buildSaveRequest(this.collateralObj, this.openType, this.uploadedFiles, this.proposalId)).subscribe(data => {
        this.close();
        
        console.log('this.router :', this.router.url);
        if (this.router.url.indexOf('collaterals') != -1) {
          this.appSharedService.setNewCollateralCloseEvent(true);
        }else {
          setTimeout(() => {
            this.router.navigate(['/dms/collaterals']);
          }, 10);
        }
        setTimeout(() => {
          this.toastr.success('Collateral Added', '', this.appSharedService.toastrOption);
        }, 100);
      },((err)=>{}),(()=>{this.spinnerService.spinner(false);}));
    }
  }
  close() {
    this.router.navigate([{ outlets: { dialogs: null } }], { relativeTo: this.acr.parent });
  }
  removeSelectedFiles(e: Event, file: any) {
    let fileIndex = this.uploadedFiles.findIndex(p => p.fileName == file.fileName);
    if (fileIndex != -1) {
      this.uploadedFiles.splice(fileIndex, 1);
    }
  }
  fileEvent(fileInput: Event) {
    if (fileInput.target["files"]) {
      this.uploadedFiles=[];
      for (let index = 0; index < fileInput.target["files"].length; index++) {
        let fileItem: any = {};
        fileItem.fileName = fileInput.target["files"][index].name;
        fileItem.file = fileInput.target["files"][index];
        this.uploadedFiles.push(fileItem);
      }
    }
    if (this.uploadedFiles && this.uploadedFiles.length) {
      this.collateralForm.get('fileUpload').setErrors(null);
    }
    
  }

  checkFileError() {
    if (!this.uploadedFiles || !this.uploadedFiles.length) {
      this.collateralForm.get('fileUpload').setErrors({'required': true});
    }
  }

  ngOnDestroy(){
    this.appSharedService.clearRouteData();
  }

}
