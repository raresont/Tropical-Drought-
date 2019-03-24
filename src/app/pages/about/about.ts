import { Component, ViewEncapsulation } from '@angular/core';

import { PopoverController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';
import { Router } from '@angular/router';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  conferenceDate = '2047-05-17';
  showSkip = true;
  element:any;
  picToView:string="assets/img/NFC_OFF.png";
  changeableBG:string="assets/img/BG_OFF.png";
  status:any = "OFF";
  dataFromFile:any;
  edited:boolean = false;
  finalForm:boolean = false;

  constructor(public popoverCtrl: PopoverController, public router: Router) { }


  ngAfterViewInit() {
  }

  addStats() {
    this.edited = false;
    this.finalForm = true;
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    await popover.present();
  }
}
