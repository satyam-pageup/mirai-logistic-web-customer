import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITotalAmountReferenceData } from '../../shared/models/rateCalculator.model';

@Component({
  selector: 'app-calculated-amount',
  templateUrl: './calculated-amount.component.html',
  styleUrl: './calculated-amount.component.scss'
})
export class CalculatedAmountComponent {
  @Output() EEformValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() referenceData!: ITotalAmountReferenceData;

  constructor(){
    
  }

  public decline(){
    this.EEformValue.emit(false);
  }
}
