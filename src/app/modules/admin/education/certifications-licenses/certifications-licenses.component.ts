import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-certifications-licenses',
  templateUrl: './certifications-licenses.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CertificationsLicensesComponent implements OnInit {

  fbuserid: string = localStorage.getItem('fbuserid');
  dialogconfigForm: FormGroup;
  item: Observable<any>;
  items: Observable<any[]>;
  listRef: AngularFireList<any>;
  showadditem = false;
  showedititem = false;
  model = new Certification('', '', '', '', '', '', '', '', '');
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];

  /**
   * Constructor
   */
   constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  onAdd(): void {

    this.listRef = this.db.list('/users/' + this.fbuserid + '/certifications');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mawardedby: string = this.model.awardedby;
    const mawardedon: string = this.model.awardedon;
    const mexpireson: string = this.model.expireson;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.listRef
      .push({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon, expireson: mexpireson });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/certifications/' + this.fbuserid + '/' + _.key)
        .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon, expireson: mexpireson }))
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  onEdit(key): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mawardedby: string = this.model.awardedby;
    const mawardedon: string = this.model.awardedon;
    const mexpireson: string = this.model.expireson;
    const mdatenow = Math.floor(Date.now());

    this.db.object('/users/' + this.fbuserid + '/certifications' + '/' + key)
      .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon, expireson: mexpireson });
    this.db.object('/certifications/' + this.fbuserid + '/' + key)
      .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon, expireson: mexpireson });
    this.showedititem = false;
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuserid + '/certifications/' + key).remove();
    this.db.object('/certifications/' + this.fbuserid + '/' + key).remove();
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
    this.item = this.db.object('/users/' + this.fbuserid + '/certifications/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe((item) => {
      this.model = new Certification(key, item.name, item.description, item.created, item.modified, item.user, item.awardedby, item.awardedon, item.expireson);
    });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new Certification('', '', '', '', '', '', '', '', '');
  }

  openConfirmationDialog(key): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.dialogconfigForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        //Call Actual Delete
        this.onDelete(key);
      }
    });
  }

  onDateChange(event: MatDatepickerInputEvent<any>, control: AbstractControl, picker: string): void {

    console.log(picker);
    if(picker === 'expire') {
      this.model.expireson = ((event.value.valueOf()).toString());
    }
    else {
      this.model.awardedon = ((event.value.valueOf()).toString());
    }

  }

  ngOnInit(): void {

    this.items = this.db.list('/users/' + this.fbuserid + '/certifications').snapshotChanges();

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
export class Certification {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,
    public awardedby: string,
    public awardedon: string,
    public expireson: string,

  ) { }

}
