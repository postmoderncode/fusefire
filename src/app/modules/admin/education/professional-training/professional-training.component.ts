import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-professional-training',
  templateUrl: './professional-training.component.html',
  styleUrls: ['./professional-training.component.scss']
})
export class ProfessionalTrainingComponent implements OnInit {

  fbuserid: string = localStorage.getItem('fbuserid');
  dialogconfigForm: FormGroup;
  item: Observable<any>;
  items: Observable<any[]>;
  listRef: AngularFireList<any>;
  showadditem = false;
  showedititem = false;
  model = new Training('', '', '', '', '', '', '', '');
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

    this.listRef = this.db.list('/users/' + this.fbuserid + '/training');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mawardedby: string = this.model.awardedby;
    const mawardedon: string = this.model.awardedon;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.listRef
      .push({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/training/' + this.fbuserid + '/' + _.key)
        .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon }))
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

    //Increment Count
    this.db.object('/counts/' + this.fbuserid + '/training').query.ref.transaction(likes => {
      if (likes === null) {
        return likes = 1;
      } else {
        return likes + 1;
      }
    })

  }

  onEdit(key): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mawardedby: string = this.model.awardedby;
    const mawardedon: string = this.model.awardedon;
    const mdatenow = Math.floor(Date.now());

    this.db.object('/users/' + this.fbuserid + '/training' + '/' + key)
      .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon });
    this.db.object('/training/' + this.fbuserid + '/' + key)
      .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuserid, awardedby: mawardedby, awardedon: mawardedon });
    this.showedititem = false;
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuserid + '/training/' + key).remove();
    this.db.object('/training/' + this.fbuserid + '/' + key).remove();

    //Decrement Count
    this.db.object('/counts/' + this.fbuserid + '/training').query.ref.transaction(likes => {
      if (likes === null) {
        return likes = 0;
      } else {
        return likes - 1;
      }
    })

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
    this.item = this.db.object('/users/' + this.fbuserid + '/training/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe((item) => {
      this.model = new Training(key, item.name, item.description, item.created, item.modified, item.user, item.awardedby, item.awardedon);
    });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new Training('', '', '', '', '', '', '', '');
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

  onDateChange(event: MatDatepickerInputEvent<any>, control: AbstractControl): void {

    this.model.awardedon = ((event.value.valueOf()).toString());
  }

  ngOnInit(): void {

    this.items = this.db.list('/users/' + this.fbuserid + '/training').snapshotChanges();

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
export class Training {

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