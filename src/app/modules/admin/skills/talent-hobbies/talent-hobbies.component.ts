import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-talent-hobbies',
  templateUrl: './talent-hobbies.component.html',
  styleUrls: ['./talent-hobbies.component.scss']
})

export class TalentHobbiesComponent implements OnInit, OnDestroy {

  //Initialize Variables
  //---------------------

  //Scroll element
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;

  //Unscubscribe All
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  //Page View State (Default is "Loading..")
  viewState = 0;

  //Form Mode State (Add vs. Edit Mode)
  formMode = '';

  //Container to hold a list of items
  items: object;

  //Container to hold a single item
  item: Observable<any>;

  //Container to hold Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Talent();

  //Constructor
  //---------------------
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  //Functions
  //---------------------

  //Fuction - Show the Add Form
  onShowAddForm(): void {

    //Set the View State
    this.viewState = 3;

    //Set the Form Mode
    this.formMode = 'add';
  }

  //Fuction - Show the Edit Form
  onShowEditForm(key): void {

    //Set the View State
    this.viewState = 3;

    //Set the Form Mode
    this.formMode = 'edit';

    //Define Observable
    this.item = this.db.object('/users/' + this.fbuser.id + '/talents/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe((item) => {
      this.model = new Talent(key, item.name, item.description, item.created, item.modified, item.user);
    });

  }

  //Function - Show the Delete Conf.
  onShowDelete(key): void {

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

  //Function - Add New Item to DB
  onAdd(form: NgForm): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.db.list('/users/' + this.fbuser.id + '/talents')
      .push({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/talents/' + this.fbuser.id + '/' + _.key)
        .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id }))
      .then(_ => form.resetForm())
      .catch(err => console.log(err, 'Error Submitting Talent!'));

    //Increment Count
    this.db.object('/counts/' + this.fbuser.id + '/talents').query.ref.transaction((likes) => {
      if (likes === null) {
        return likes = 1;
      } else {
        return likes + 1;
      }
    });

    this.cdkScrollable.scrollTo({ top: 0 });

  }

  //Function - Update Item in DB
  onEdit(key): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;
    const mdatenow = Math.floor(Date.now());

    this.db.object('/users/' + this.fbuser.id + '/talents/' + key)
      .update({ name: mname, description: mdescription, modified: mdatenow });
    this.db.object('/talents/' + this.fbuser.id + '/' + key)
      .update({ name: mname, description: mdescription, modified: mdatenow });

    this.cdkScrollable.scrollTo({ top: 0 });

  }

  //Function - Delete Item in DB
  onDelete(key): void {
    this.db.object('/users/' + this.fbuser.id + '/talents/' + key).remove();
    this.db.object('/talents/' + this.fbuser.id + '/' + key).remove();

    //Decrement Count
    this.db.object('/counts/' + this.fbuser.id + '/talents').query.ref.transaction((likes) => {
      if (likes === null) {
        return likes = 0;
      } else {
        return likes - 1;
      }
    });

    console.log(key + ' deleted');

  }

  //Function - Cancel the Add or Edit Form
  onCancelForm(form: NgForm): void {
    form.resetForm();
    this.viewState = 1;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    //Call the Firebase Database and get the initial data.
    this.db.list('/users/' + this.fbuser.id + '/talents').snapshotChanges().subscribe(
      (results: object) => {

        //Put the results of the DB call into an object.
        this.items = results;

        console.log(this.items);

        //Check if the results object is empty
        if (Object.keys(this.items).length === 0) {
          //It's empty, so set the view state to "No Data" mode.
          this.viewState = 2;
        }
        else {
          //It's not empty, so set the view state to "Show Data" mode.
          this.viewState = 1;
        };

      }
    );

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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}

// -----------------------------------------------------------------------------------------------------
// @ Models
// -----------------------------------------------------------------------------------------------------


// Empty Talent class
export class Talent {

  constructor(
    public key: string = '',
    public name: string = '',
    public description: string = '',
    public created: string = '',
    public modified: string = '',
    public user: string = '',

  ) { }

}