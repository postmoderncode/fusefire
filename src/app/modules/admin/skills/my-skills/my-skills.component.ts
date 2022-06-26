import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-my-skills',
  templateUrl: './my-skills.component.html',
  styleUrls: ['./my-skills.component.scss']
})
export class MySkillsComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Scroll element
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new UserSkill();
  catmodel = new CatalogState();

  //Firebase Observables
  listRef: AngularFireList<any>;

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;

  //Object to Hold All Areas.
  areas: Observable<any>;

  //Object to Hold Current Category List.
  categories: object;

  //Object to Hold Current Skill List.
  skills: object;

  //General Component Variables
  selectedIndex = 0;
  tabTitle = 'Area';

  //Search Variables
  searchresults: object;
  qresults1;
  qresults2;
  qresults3;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  //Function to Handle the Back Arrow
  goback(): void {
    switch (this.selectedIndex) {
      case 1: {
        console.log('goback 1');
        this.tabTitle = 'Area';
        this.selectedIndex = 0;
        this.catmodel.currentCategory = '';
        this.catmodel.currentSkill = '';
        break;
      }
      case 2: {
        console.log('goback 2');
        this.tabTitle = 'Category';
        this.selectedIndex = 1;
        this.catmodel.currentSkill = '';
        break;
      }
    }
  }

  //Function for unique value of name for search/duplicates
  onConvertName(name: string): string {
    //trim leading and trailing spaces
    const trimname: string = name.trim();

    //replace spaces and multiple spaces with dash
    const dashname: string = trimname.replace(/\s+/g, '-');

    //covert to lowercase
    const value: string = dashname.toLowerCase();

    return value;

  }

  //Function to search through skills for filtered querytext
  onSearch(queryText: string): void {


    //Only search if search term exists
    if (queryText.length > 1) {

      //Searh Skills by Unique Value
      this.qresults1 = this.db.list('/skillcatalog/skills/', ref => ref
        .orderByChild('value')
        .startAt(this.onConvertName(queryText))
        .endAt(this.onConvertName(queryText) + '\uf8ff')).snapshotChanges();

      //Search User by Name
      this.qresults2 = this.db.list('/users/', ref => ref
        .orderByChild('name')
        .startAt(queryText)
        .endAt(queryText + '\uf8ff')).snapshotChanges();

      //Search User by Email
      this.qresults3 = this.db.list('/users/', ref => ref
        .orderByChild('email')
        .startAt(queryText)
        .endAt(queryText + '\uf8ff')).snapshotChanges();

      //Combine search results
      this.qresults1.subscribe((searchskill) => {
        this.qresults2.subscribe((searchuser) => {
          this.qresults3.subscribe((searchemail) => {

            let results

            results = searchskill.concat(searchuser);
            this.searchresults = results.concat(searchemail);

          });

        });

      });

    }

  }

  //Function to call when an area is selected
  onAreaSelect(areaId): void {

    //Populate Categories - Firebase List w/ Sort&Filter Query
    this.db.list('/skillcatalog/categories/', ref => ref
      .orderByChild('area')
      .equalTo(areaId))
      .snapshotChanges().subscribe(
        (results: object) => { this.categories = results; }
      );

    //Set the title
    this.tabTitle = 'Category';

    //Set the tab to categories
    this.selectedIndex = 1;

    this.catmodel.currentArea = areaId;

    console.log(this.tabTitle);

  }

  //Function to call when a category is selected
  onCategorySelect(categoryId): void {

    console.log(categoryId);

    //Populate Categories - Firebase List w/ Sort&Filter Query
    this.db.list('/skillcatalog/skills/', ref => ref
      .orderByChild('category')
      .equalTo(categoryId))
      .snapshotChanges().subscribe(
        (results: object) => { this.skills = results; }
      );

    this.tabTitle = 'Skill';
    this.selectedIndex = 2;
    this.catmodel.currentCategory = categoryId;
  }

  //Function to call when a skill is selected
  selectSkill(skillId, skillName): void {
    this.catmodel.currentSkill = skillId;
    this.model.key = skillId;
    this.model.name = skillName;
    this.showedititem = false;
    this.showadditem = true;

  }

  onAdd(): void {


    this.listRef = this.db.list('/users/' + this.fbuser.id + '/skills');

    //Cast model to variable for formReset
    const mkey: string = this.model.key;
    const mname: string = this.model.name;
    const mrating: number = this.model.rating;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.listRef.push({ key: mkey, name: mname, rating: mrating, created: mdatenow, modified: mdatenow, user: this.fbuser.id });

    //Call Promise
    promiseAddItem
      .then(_ => this.db.object('/skills/' + this.fbuser.id + '/' + _.key)
        .update({ key: mkey, name: mname, rating: mrating, created: mdatenow, modified: mdatenow, user: this.fbuser.id }))
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

    //Increment Count
    this.db.object('/counts/' + this.fbuser.id + '/skills').query.ref.transaction((likes) => {
      if (likes === null) {
        return likes = 1;
      } else {
        return likes + 1;
      }
    });

    console.log('add clicked');

    this.cdkScrollable.scrollTo({ top: 0 });
  }

  onEdit(key): void {

    // //Cast model to variable for formReset
    // const mname: string = this.model.name;
    // const mdescription: string = this.model.description;
    // const mdatenow = Math.floor(Date.now());

    // this.db.object('/users/' + this.fbuser.id + '/talents' + '/' + key)
    //   .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });
    // this.db.object('/talents/' + this.fbuser.id + '/' + key)
    //   .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });
    // this.showedititem = false;
    console.log(key + ' edited');
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuser.id + '/skills/' + key).remove();
    this.db.object('/skills/' + this.fbuser.id + '/' + key).remove();

    //Decrement Count
    this.db.object('/counts/' + this.fbuser.id + '/skills').query.ref.transaction(likes => {
      if (likes === null) {
        return likes = 0;
      } else {
        return likes - 1;
      }
    })

    console.log(key + ' deleted');

  }

  //Contextual Button based on tabTitle
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
    console.log('edit form shown');
    this.showadditem = false;
    this.showedititem = true;
    this.cdkScrollable.scrollTo({ top: 0 });

    // //Define Observable
    // this.item = this.db.object('/users/' + this.fbuser.id + '/talents/' + key).valueChanges();

    // //Subscribe to Observable
    // this.item.subscribe((item) => {
    //   this.model = new Talent(key, item.name, item.description, item.created, item.modified, item.user);
    // });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new UserSkill();
    this.cdkScrollable.scrollTo({ top: 0 });
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

    //Populate Areas - Firebase List Object
    this.areas = this.db.list('/skillcatalog/areas/').snapshotChanges();


    //Formbuilder for Dialog Popup
    this.dialogconfigForm = this._formBuilder.group({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this ' + this.tabTitle + ' permanently? <span class="font-medium">This action cannot be undone!</span>',
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

// Empty UserSkill class
export class UserSkill {

  constructor(
    public key: string = '',
    public name: string = '',
    public rating: number = 0,
    public priority: number = 0,
    public created: string = '',
    public modified: string = '',
    public user: string = '',

  ) { }

}

// Empty CatalogState class
export class CatalogState {

  constructor(
    public currentArea?: string,
    public currentCategory?: string,
    public currentSkill?: string,

  ) { }

}

