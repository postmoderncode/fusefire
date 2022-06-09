import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-awards-accolades',
  templateUrl: './awards-accolades.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AwardsAccoladesComponent implements OnInit {

  model = new Award('', '', '', '', '', '', '', '');
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];
  listRef: AngularFireList<any>;
  item: Observable<any>;
  items: Observable<any[]>;
  showadditem = false;
  showedititem = false;
  fbuserid: string = localStorage.getItem('fbuserid');
  configForm: FormGroup;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  onSubmit(): void {

    this.listRef = this.db.list('/users/' + this.fbuserid + '/awards');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    //Define Promise
    const promiseAddItem = this.listRef.push({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/awards/' + this.fbuserid + '/' + _.key)
        .update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid }))
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  onEdit(key): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    this.db.object('/users/' + this.fbuserid + '/awards' + '/' + key)
      .update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid });
    this.db.object('/awards/' + this.fbuserid + '/' + key)
      .update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid });
    this.showedititem = false;
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuserid + '/awards/' + key).remove();
    this.db.object('/awards/' + this.fbuserid + '/' + key).remove();
    console.log(key + ' deleted');

  }

  onShowAddForm(): void {
    this.showedititem = false;
    this.showadditem = true;
  }

  onHideAddForm(): void {
    this.showadditem = false;
  }

  onShowEditForm(key): void {
    this.showadditem = false;
    this.showedititem = true;

    //Define Observable
    this.item = this.db.object('/users/' + this.fbuserid + '/awards/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe((item) => {
      this.model = new Award(key, item.name, item.description, item.created, item.modified, item.user, item.awardedby, item.awardedon);
    });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new Award('', '', '', '', '', '', '', '');
  }

  openConfirmationDialog(key): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.onDelete(key);
      }
    });
  }

  ngOnInit(): void {

    this.items = this.db.list('/users/' + this.fbuserid + '/awards').snapshotChanges();

    this.configForm = this._formBuilder.group({
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
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,
    public awardedby: string,
    public awardedon: string,

  ) { }



}
