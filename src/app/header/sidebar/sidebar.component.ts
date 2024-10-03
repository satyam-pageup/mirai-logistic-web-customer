import { Component } from '@angular/core';
import { ComponentBase } from '../../shared/classes/component-base';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends ComponentBase {
  public isRatecardConfigurationOpen: boolean = false;
  public isMasterConfigurationOpen: boolean = false;
  public isPickupManagement: boolean = false;
  constructor() {
    super();
  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      let arrow = document.querySelectorAll(".arrow");
      for (let i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e) => {
          let arrowParent = (e.target as HTMLElement).parentElement?.parentElement; // selecting main parent of arrow
          if (arrowParent) {
            arrowParent.classList.toggle("showMenu");
          }
        });
      }
    }
  }

  public toggleMasterConfiguration() {
    this.isMasterConfigurationOpen = !this.isMasterConfigurationOpen
    this.isPickupManagement = false;
    this.isRatecardConfigurationOpen = false;
  }
  public togglePickupConfiguration() {
    this.isPickupManagement = !this.isPickupManagement
    this.isMasterConfigurationOpen = false;
    this.isRatecardConfigurationOpen = false;
  }
  public toggleRatecardConfiguration() {
    this.isRatecardConfigurationOpen = !this.isRatecardConfigurationOpen
    this.isPickupManagement = false;
    this.isMasterConfigurationOpen = false;
  }

}
