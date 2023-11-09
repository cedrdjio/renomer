import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AbstractComponent} from "../../../../shared/components/abstract-component";
import {fadeInAnimation} from "../../../../shared/data/router-animation/router-animation";
import {NavService} from "../../../../shared/services/nav.service";

import * as feather from 'feather-icons';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
    animations: [fadeInAnimation]
})
export class IndexComponent extends AbstractComponent<any> implements OnInit, AfterViewInit {


  constructor( private router:Router,
               public navServices: NavService,
               private modalService:NgbModal,) {
    super();
  }

  ngOnInit() {

  }

    ngAfterViewInit() {
        setTimeout(() => {
            feather.replace();
        });
    }

    public getRouterOutletState(outlet) {
        return outlet.isActivated ? outlet.activatedRoute : '';
    }


  open(content:any){
    this.modalService.open(content, { centered: true });

  }

  hide() {
    this.modalService.dismissAll();
  }




}
