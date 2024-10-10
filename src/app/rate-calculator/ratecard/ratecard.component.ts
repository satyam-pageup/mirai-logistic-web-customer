import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Identity } from '../../shared/interface/response/response';
import { IPincodeDetails } from '../../shared/interface/response/pincode.response';
import { ApiRoutes } from '../../shared/constants/apiRoutes';
import { BoxInfoForm, IRateRequestForm, ITotalAmountReferenceData } from '../../shared/models/rateCalculator.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BoxInfo, IRateRequest, Volume } from '../../shared/interface/request/rateCalculator.request';
import { Icharges, IRateDetails } from '../../shared/interface/response/rateCalculator.response';

@Component({
  selector: 'app-ratecard',
  templateUrl: './ratecard.component.html',
  styleUrl: './ratecard.component.scss'
})
export class RatecardComponent extends ComponentBase implements OnInit {
  @ViewChild('template') modalTemplate!: TemplateRef<any>;
  public modelRef?: BsModalRef;
  resolve: any;
  public remainingQuantity: number = 0;
  public newQuantity: number = 0;
  public shipmentMode!: IPincodeDetails | null;
  public referenceData!: ITotalAmountReferenceData;

  public rateCalculatorForm: FormGroup<IRateRequestForm> = new FormGroup<IRateRequestForm>({
    sourcePincode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{6}$/)]),
    destinationPincode: new FormControl(null, [Validators.required, Validators.pattern(/^\d{6}$/)]),
    serviceType: new FormControl(null, [Validators.required]),
    boxInfos: new FormArray<FormGroup<BoxInfoForm>>([this.boxInfoForm()])
  })

  public addBoxInfo(): void {
    this.rateCalculatorForm.controls.boxInfos.push(this.boxInfoForm());
  }

  public boxInfoForm(): FormGroup<BoxInfoForm> {
    const boxInfo = new FormGroup<BoxInfoForm>({
      quantity: new FormControl(null, Validators.required),
      weight: new FormControl(null, Validators.required),
      volumes: new FormArray<FormGroup<any>>([this.volumeForm()])
    });
    return boxInfo;
  }

  public addVolume(index: number): void {
    const boxInfo = this.rateCalculatorForm.controls.boxInfos.at(index) as FormGroup<BoxInfoForm>;
    boxInfo.controls.volumes.push(this.volumeForm());
  }

  public volumeForm(): FormGroup<any> {
    const volume = new FormGroup({
      quantity: new FormControl(null, Validators.required),
      length: new FormControl(null, Validators.required),
      width: new FormControl(null, Validators.required),
      height: new FormControl(null, Validators.required),
    });
    return volume;
  }


  constructor(private modalService: BsModalService) {
    super()
  }

  ngOnInit(): void {
    this.rateCalculatorForm.controls.boxInfos.at(0).controls.quantity.valueChanges.subscribe((res) => {
      this.onVolumeQuantityChange(0, this.rateCalculatorForm.controls.boxInfos.at(0).controls.volumes.length - 1, 0);
    })

    this.rateCalculatorForm.controls.destinationPincode.valueChanges.subscribe((value) => {
      if (this.rateCalculatorForm.controls.destinationPincode.valid) {
        this.shipmentMode = null;
        const data: { pincode: string } = {
          pincode: this.rateCalculatorForm.controls.destinationPincode.value!
        }
        this.postAPICallPromise<{ pincode: string }, Identity<IPincodeDetails>>(ApiRoutes.ratecard.getPincodeDetails(parseInt(this.rateCalculatorForm.controls.destinationPincode.value!)), data, this.headerOption).then(
          (res) => {
            this.shipmentMode = res.data
            console.log(res.data)
          })
      }
    })
  }


  public onVolumeQuantityChange(pIndex: number, vIndex: number, check: number) {
    console.log(pIndex, vIndex, check)
    this.newQuantity = 0;
    let inputValue;
    if (vIndex === -1 && this.remainingQuantity == 0) {
      vIndex = this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length - 1;
      inputValue = this.rateCalculatorForm.controls.boxInfos.at(pIndex)?.controls.volumes.at(vIndex).controls.quantity.value!
    }
    else if (vIndex === -1 && this.remainingQuantity != 0) {
      vIndex = 0;
      if (this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length >= 2) {
        inputValue = this.rateCalculatorForm.controls.boxInfos.at(pIndex)?.controls.volumes.at(vIndex).controls.quantity.value!
      }
      else {
        inputValue = 0;
      }
    }
    else {
      inputValue = this.rateCalculatorForm.controls.boxInfos.at(pIndex)?.controls.volumes.at(vIndex).controls.quantity.value
    }

    const totalQuantity = this.rateCalculatorForm.controls.boxInfos.at(pIndex)?.controls.quantity.value!;
    //check == -1 -> case of remove
    //check == 0 -> form input field
    if (check == 0) {
      for (let i = 0; i < this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length; i++) {
        if (this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value != null)
          this.newQuantity += parseInt(this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value + "");
      }
    }
    else {
      if (this.remainingQuantity == 0) {
        for (let i = 0; i < this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length; i++) {
          this.newQuantity += parseInt(this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value + "");
        }
      }
      else {
        for (let i = 0; i < this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length - 1; i++) {
          this.newQuantity += parseInt(this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.controls.at(i)?.controls.quantity.value + "");
        }
      }
    }
    if (totalQuantity >= this.newQuantity) {
      if (check == 0 && inputValue != 0 && inputValue != null && totalQuantity > this.newQuantity) {
        // this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.push(this.volumeForm())
        this.addVolume(pIndex);
      }
      else if (check == -1 && this.remainingQuantity == 0 && totalQuantity > this.newQuantity) {
        this.addVolume(pIndex);
      }
    }
    this.remainingQuantity = totalQuantity - this.newQuantity;

  }

  public remove(pIndex: number, vIndex: number) {
    if (this.remainingQuantity != 0 && vIndex != this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length - 1) {
      this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.controls.splice(vIndex, 1);
      this.onVolumeQuantityChange(pIndex, vIndex - 1, -1)
    }
    else if (this.remainingQuantity == 0 && this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.length > 0) {
      this.rateCalculatorForm.controls.boxInfos.at(pIndex).controls.volumes.controls.splice(vIndex, 1);
      this.onVolumeQuantityChange(pIndex, vIndex - 1, -1)
    }
  }


  public getRate() {
    this.rateCalculatorForm.markAllAsTouched();
    const config = {
      ignoreBackdropClick: true,
      class: 'modal-md'
    };
    const data: IRateRequest = {
      destinationPincode: this.rateCalculatorForm.controls.destinationPincode.value!,
      serviceType: this.rateCalculatorForm.controls.serviceType.value!,
      sourcePincode: this.rateCalculatorForm.controls.sourcePincode.value!,
      boxInfos: this.boxInfo()
    }
    if (this.rateCalculatorForm.valid) {
      this.postAPICallPromise<IRateRequest, Identity<IRateDetails<Icharges>>>(ApiRoutes.ratecard.getRate, data, this.headerOption).then(
        (res) => {
          if (res?.data) {
            this.referenceData = {
              destinationPincode: this.rateCalculatorForm.controls.destinationPincode.value!,
              sourcePincode: this.rateCalculatorForm.controls.sourcePincode.value!,
              totalPrice: res.data.totalPrice,
              quantity: this.rateCalculatorForm.controls.boxInfos.at(0).controls.quantity.value!,
              serviceType: this.rateCalculatorForm.controls.serviceType.value!,
              charges:res.data.charges!,
              volume: this.getTotalVolume(),
              price:res.data.price
            }
            this.modelRef = this.modalService.show(this.modalTemplate, config);
          }
          else {
            this.toasterService.error("Source/ Destination Zone is not valid")
          }
        }
      )
        .catch(
          (err) => {
            this.toasterService.error("Something went wrong")
          }
        )
    }
  }

  private boxInfo() {
    let boxInfoDetails: BoxInfo[] = []
    this.rateCalculatorForm.controls.boxInfos.controls.forEach((res, i) => {
      const data: BoxInfo = {
        quantity: res.controls.quantity.value!,
        weight: res.controls.weight.value!,
        volumes: this.getVolume(i)
      }
      boxInfoDetails.push(data);
    })
    return boxInfoDetails;
  }

  private getVolume(index: number) {
    const obj: Array<Volume> = []
    this.rateCalculatorForm.controls.boxInfos.controls.at(index)?.controls.volumes.controls.forEach((res) => {
      const newObj: Volume = {
        quantity: res.controls.quantity.value!,
        width: res.controls.width.value!,
        length: res.controls.length.value!,
        height: res.controls.height.value!
      }
      obj.push(newObj);
    });
    return obj;
  }

  private getTotalVolume() {
    let volume = 0;
    this.rateCalculatorForm.controls.boxInfos.controls.at(0)?.controls.volumes.controls.forEach((res) => {
      volume += ((res.controls.length.value! * res.controls.width.value! * res.controls.height.value!) / 4500) * res.controls.quantity.value!;
    });
    return volume.toFixed(2);
  }

  public getFormDataE(data: any) {
    if (data) {
      this.modelRef?.hide();
    }
    else {
      this.modelRef?.hide();
    }
  }

}
