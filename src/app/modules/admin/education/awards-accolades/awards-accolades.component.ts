import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-awards-accolades',
  templateUrl: './awards-accolades.component.html',

})
export class AwardsAccoladesComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Scroll element
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Award();

  //Table Control
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];

  //Firebase Observables
  item: Observable<any>;
  items: Observable<any[]>;
  listRef: AngularFireList<any>;

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

    this.listRef = this.db.list('/users/' + this.fbuser.id + '/awards');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mawardedby: string = this.model.awardedby;
    const mawardedon: string = this.model.awardedon;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.listRef
      .push({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id, awardedby: mawardedby, awardedon: mawardedon });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/awards/' + this.fbuser.id + '/' + _.key)
        .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id, awardedby: mawardedby, awardedon: mawardedon }))
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Award!'));

    //Increment Count
    this.db.object('/counts/' + this.fbuser.id + '/awards').query.ref.transaction((likes) => {
      if (likes === null) {
        return likes = 1;
      } else {
        return likes + 1;
      }
    });

    this.cdkScrollable.scrollTo({ top: 0 });

  }

  onEdit(key): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mawardedby: string = this.model.awardedby;
    const mawardedon: string = this.model.awardedon;
    const mdatenow = Math.floor(Date.now());

    this.db.object('/users/' + this.fbuser.id + '/awards' + '/' + key)
      .update({ name: mname, description: mdescription, modified: mdatenow, awardedby: mawardedby, awardedon: mawardedon });
    this.db.object('/awards/' + this.fbuser.id + '/' + key)
      .update({ name: mname, description: mdescription, modified: mdatenow, awardedby: mawardedby, awardedon: mawardedon });
    this.showedititem = false;
    this.cdkScrollable.scrollTo({ top: 0 });
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuser.id + '/awards/' + key).remove();
    this.db.object('/awards/' + this.fbuser.id + '/' + key).remove();

    //Decrement Count
    this.db.object('/counts/' + this.fbuser.id + '/awards').query.ref.transaction((likes) => {
      if (likes === null) {
        return likes = 0;
      } else {
        return likes - 1;
      }
    });

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

    //Define Observable
    this.item = this.db.object('/users/' + this.fbuser.id + '/awards/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe((item) => {
      this.model = new Award(key, item.name, item.description, item.created, item.modified, item.user, item.awardedby, item.awardedon);
    });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new Award();
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  openConfirmationDialog(key): void {
    //Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.dialogconfigForm.value);

    //Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        //Call Actual Delete
        this.onDelete(key);
      }
    });
  }

  onDateChange(event: MatDatepickerInputEvent<any>, control: AbstractControl): void {

    this.model.awardedon = ((event.value.valueOf()).toString());
  }

  ngOnInit(): void {

    this.items = this.db.list('/users/' + this.fbuser.id + '/awards').snapshotChanges();

    //Formbuilder for Dialog Popup
    this.dialogconfigForm = this._formBuilder.group({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel'
        })
      }),
      dismissible: false
    });

  }

}

// Empty Award class
export class Award {

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
