import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entitlement } from '../../shared/utils/entitlement';

@Component({
  selector: 'app-proposal-card',
  providers: [Entitlement],
  templateUrl: './proposal-card.component.html',
  styleUrls: ['./proposal-card.component.scss']
})
export class ProposalCardComponent implements OnInit {
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
  
  @Output() public edit = new EventEmitter<any>();
  @Output() public add = new EventEmitter<any>();
  @Output() public viewCollaterals = new EventEmitter<any>();
  @Output() public delete = new EventEmitter<any>();


  constructor(public entitlement:Entitlement) { }

  ngOnInit() {
  }
  getColor(status){
    let statusText: any = status.toLowerCase();
    switch (statusText) {
      case "in-progress":
        return "#ffad66";
      case "lost":
        return "#fb6262";
      case "new":
        return "#69ffbd";
      case "review":
        return "#62affb";
      case "won":
        return "#f8e52d";
      default:
        break;
    }
    return "#000"
  }
  onEdit(event) {
    this.edit.emit({ "index": this.cardIndex });
  }
  onAdd(event) {
    this.add.emit({ "index": this.cardIndex });
  }
  onViewCollaterals(event) {
    this.viewCollaterals.emit({ "index": this.cardIndex });
  }
  onDelete(event) {
    this.delete.emit({ index: this.cardIndex });
  }
}
