import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';
import _ from 'lodash';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  fbuser = JSON.parse(localStorage.getItem('fbuser'));


  /**
   * Constructor
   */
  constructor(
    public db: AngularFireDatabase
  ) { }


  ngOnInit(): void {

  }

}


