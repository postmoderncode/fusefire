import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable, map } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Firebase Observables
  item: Observable<any>;
  items: Observable<any[]>;
  listRef: AngularFireList<any>;


  /**
   * Constructor
   */
  constructor(
    public db: AngularFireDatabase
  ) { }

  ngOnInit(): void {

    this.item = this.db.object('/users/' + this.fbuser.id).valueChanges();


  }

}
