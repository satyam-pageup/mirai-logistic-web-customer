import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  @Input('messageBody') messageBody!: String;
  @ViewChild('template') modalTemplate!: TemplateRef<any>; //getting access to html,
  public modelRef?: BsModalRef;
  resolve: any;
  public heading: string = '';

  constructor(private modalService: BsModalService, private dialogService: DialogService) {
    this.dialogService.confirmationDialogEvent.subscribe(({ resolve, heading: head, message: message }) => {
      this.messageBody = message;
      this.resolve = resolve;
      if (head != null)
        this.heading = head ? "Deactivate" : "Activate"
      else
        this.heading= "Delete"
      this.modelRef = this.modalService.show(this.modalTemplate)
    })
  }

  ngOnInit(): void {

  }

  public openModal() {
    this.modelRef = this.modalService.show(this.modalTemplate, { class: 'modal-sm' });
    return new Promise((resolve) => {
      this.resolve = resolve;
    })
  }

  public confirm() {
    this.resolve(true);
    this.modelRef?.hide();
  }

  public decline() {
    this.modelRef?.hide();
    this.resolve(false);
  }
}
