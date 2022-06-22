import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Scroll element
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Position();

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }


  onAdd(): void {

    // this.listRef = this.db.list('/users/' + this.fbuser.id + '/training');

    // //Cast model to variable for formReset
    // const mname: string = this.model.name;
    // const mdescription: string = this.model.description;
    // const mawardedby: string = this.model.awardedby;
    // const mawardedon: string = this.model.awardedon;
    // const mdatenow = Math.floor(Date.now());

    // //Define Promise
    // const promiseAddItem = this.listRef
    //   .push({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id, awardedby: mawardedby, awardedon: mawardedon });

    // //Call Promise
    // promiseAddItem
    //   .then(_ => this.db.object('/training/' + this.fbuser.id + '/' + _.key)
    //     .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id, awardedby: mawardedby, awardedon: mawardedon }))
    //   .then(_ => this.showadditem = false)
    //   .catch(err => console.log(err, 'Error Submitting Talent!'));

    // //Increment Count
    // this.db.object('/counts/' + this.fbuser.id + '/training').query.ref.transaction((likes) => {
    //   if (likes === null) {
    //     return likes = 1;
    //   } else {
    //     return likes + 1;
    //   }
    // });

    this.cdkScrollable.scrollTo({ top: 0 });

  }

  onEdit(key): void {

    // //Cast model to variable for formReset
    // const mname: string = this.model.name;
    // const mdescription: string = this.model.description;
    // const mawardedby: string = this.model.awardedby;
    // const mawardedon: string = this.model.awardedon;
    // const mdatenow = Math.floor(Date.now());

    // this.db.object('/users/' + this.fbuser.id + '/training' + '/' + key)
    //   .update({ name: mname, description: mdescription, modified: mdatenow, awardedby: mawardedby, awardedon: mawardedon });
    // this.db.object('/training/' + this.fbuser.id + '/' + key)
    //   .update({ name: mname, description: mdescription, modified: mdatenow, awardedby: mawardedby, awardedon: mawardedon });
    // this.showedititem = false;
    // this.cdkScrollable.scrollTo({ top: 0 });
    console.log(key + ' edited');
  }

  onDelete(key): void {
    // this.db.object('/users/' + this.fbuser.id + '/training/' + key).remove();
    // this.db.object('/training/' + this.fbuser.id + '/' + key).remove();

    // //Decrement Count
    // this.db.object('/counts/' + this.fbuser.id + '/training').query.ref.transaction((likes) => {
    //   if (likes === null) {
    //     return likes = 0;
    //   } else {
    //     return likes - 1;
    //   }
    // });

    console.log(key + ' deleted');

  }

  onShowAddForm(): void {
    this.showedititem = false;
    this.showadditem = true;
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  onHideAddForm(): void {
    this.showadditem = false;
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  onShowEditForm(key): void {
    this.showadditem = false;
    this.showedititem = true;
    this.cdkScrollable.scrollTo({ top: 0 });

    // //Define Observable
    // this.item = this.db.object('/users/' + this.fbuser.id + '/training/' + key).valueChanges();

    // //Subscribe to Observable
    // this.item.subscribe((item) => {
    //   this.model = new Training(key, item.name, item.description, item.created, item.modified, item.user, item.awardedby, item.awardedon);
    // });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    //this.model = new Training();
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  ngOnInit(): void {
  }

}

// Empty Training class
export class Position {

  constructor(
    public key: string = '',
    public name: string = '',
    public description: string = '',
    public created: string = '',
    public modified: string = '',
    public user: string = '',
    public awardedby: string = '',
    public awardedon: string = '',

  ) { }

}
