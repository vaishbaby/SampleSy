import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entitlement } from '../../shared/utils/entitlement';

@Component({
  selector: 'app-collateral-card',
  providers: [Entitlement],
  templateUrl: './collateral-card.component.html',
  styleUrls: ['./collateral-card.component.scss']
})
export class CollateralCardComponent implements OnInit {
  marginLeftFlag = false;
  @Input('card') card: any = null;

  _cardIndex: any = null;
  @Input('cardIndex')
  set cardIndex(value: boolean) {
    this._cardIndex = value;
    this.marginLeftFlag = (+this._cardIndex) % 5 == 0;
  }
  get cardIndex(): boolean {
    return this._cardIndex;
  }

  

  @Output() public delete = new EventEmitter<any>();
  @Output() public edit = new EventEmitter<any>();
  @Output() public view = new EventEmitter<any>();
  @Output() public download = new EventEmitter<any>();


  constructor(public entitlement:Entitlement) { }

  ngOnInit() {
  }
  onDelete(event) {
    this.delete.emit({ "index": this.cardIndex });
  }
  onEdit(event) {
    this.edit.emit({ "index": this.cardIndex });
  }
  onView(event) {
    this.view.emit({ "index": this.cardIndex });
  }
  onDownload(event) {
    this.download.emit({ "index": this.cardIndex });
  }
}
