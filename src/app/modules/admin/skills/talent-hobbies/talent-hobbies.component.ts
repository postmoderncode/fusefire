import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  model = new Talent('', '', '', '', '', '');
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];
  listRef: AngularFireList<any>;
  item: Observable<any>;
  items: Observable<any[]>;
  showadditem = false;
  showedititem = false;
  fbuser = JSON.parse(localStorage.getItem('fbuser'));
  dialogconfigForm: FormGroup;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  onAdd(): void {

    this.listRef = this.db.list('/users/' + this.fbuser.id + '/talents');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.listRef.push({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/talents/' + this.fbuser.id + '/' + _.key)
        .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id }))
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

    //Increment Count
    this.db.object('/counts/' + this.fbuser.id + '/talents').query.ref.transaction(likes => {
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
    const mdatenow = Math.floor(Date.now());

    this.db.object('/users/' + this.fbuser.id + '/talents' + '/' + key)
      .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });
    this.db.object('/talents/' + this.fbuser.id + '/' + key)
      .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });
    this.showedititem = false;
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuser.id + '/talents/' + key).remove();
    this.db.object('/talents/' + this.fbuser.id + '/' + key).remove();

    //Decrement Count
    this.db.object('/counts/' + this.fbuser.id + '/talents').query.ref.transaction(likes => {
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
    this.item = this.db.object('/users/' + this.fbuser.id + '/talents/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe((item) => {
      this.model = new Talent(key, item.name, item.description, item.created, item.modified, item.user);
    });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new Talent('', '', '', '', '', '');
  }

  openConfirmationDialog(key): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.dialogconfigForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.onDelete(key);
      }
    });
  }

  ngOnInit(): void {

    this.items = this.db.list('/users/' + this.fbuser.id + '/talents').snapshotChanges();

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

// Empty Talent class
export class Talent {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,

  ) { }

}


