import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-academic-degrees',
  templateUrl: './academic-degrees.component.html',
  styleUrls: ['./academic-degrees.component.scss']
})
export class AcademicDegreesComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Education('', '', '', '', '', '', '', false, '', '', '');

  gradDate = 'Expected Graduation Date';

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;

  //Autocomplete Data
  schoolfilteredData;
  fieldfilteredData;
  schooloptions: string[] = ['Ball State University', 'Indiana University', 'Notre Dame', 'Purdue University', 'Indiana Tech'];
  fieldoptions: string[] = ['Accounting', 'Advertising', 'African-American Studies', 'Agriculture', 'Animal Science', 'Anthropology', 'Aerospace Engineering', 'Archaeology', 'Architecture', 'Art History', 'Arts Management', 'Asian-American Studies', 'Astronomy and Astrophysics', 'Bilingual/Crosscultural Education', 'Athletic Training', 'Biochemistry', 'Biology', 'Biomedical Engineering', 'Business', 'Chemical Engineering', 'Chemistry', 'Civil Engineering', 'Classical Studies', 'Communication Disorders Sciences and Services', 'Communications', 'Comparative Literature', 'Computer Engineering', 'Computer Information Systems', 'Computer Science', 'Construction Services', 'Cosmetology Services', 'Creative Writing', 'Criminology', 'Culinary Arts', 'Cybersecurity', 'Design', 'Economics', 'Education', 'Electrical Engineering', 'Elementary Education', 'Engineering', 'English Language and Literature', 'Entomology', 'Environmental Engineering', 'Film and Video Production', 'Film-Video Arts', 'Finance', 'Fine Arts', 'Fire Safety Science', 'Food Science', 'Foreign Languages', 'Forestry', 'Gender Studies', 'Genetics', 'Geology', 'Graphic Design', 'Health Sciences', 'History', 'Hospitality Management', 'Human Ecology', 'Industrial Technology', 'International Business', 'International Relations', 'Journalism', 'Kinesiology', 'Latin American Studies', 'Liberal Studies', 'Library Science', 'Linguistics', 'Logistics Management', 'Marketing', 'Mathematics', 'Mechanical Engineering', 'Medical Technology', 'Metallurgical Engineering', 'Meteorology', 'Microbiology', 'Military Technology', 'Mining and Mineral Engineering', 'Music', 'Mythology and Folklore', 'Naval Architecture and Marine Engineering', 'Neuroscience', 'Nuclear Engineering', 'Nursing', 'Oceanography', 'Occupational Health and Safety', 'Parks, Recreation, and Leisure Studies', 'Performing Arts', 'Petroleum Engineering', 'Pharmacology', 'Philosophy', 'Photography', 'Physics', 'Physiology', 'Plant Science', 'Political Science', 'Pre-Law', 'Psychology', 'Public Administration', 'Puppetry', 'Religious Studies', 'Rhetoric', 'Social Work', 'Sociology', 'Software Engineering', 'Special Education', 'Sports Medicine', 'Statistics', 'Student Counseling', 'Supply Chain Management', 'Theater Arts', 'Viticulture', 'Zoology']

  //Dropdown List Data
  degreetypesfilteredData;
  states = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }];

  degreelevels =
    [
      { id: '1', name: 'Associate' },
      { id: '2', name: 'Bachelors' },
      { id: '3', name: 'Masters' },
      { id: '4', name: 'Doctorate' }
    ];

  degreetypes =
    [
      { name: 'Associate of Arts (AA)', degreeLevel: '1' },
      { name: 'Associate of Science (AS)', degreeLevel: '1' },
      { name: 'Associate of Applied Science (AAS)', degreeLevel: '1' },
      { name: 'Associate of Applied Arts and Science (AAAS)', degreeLevel: '1' },
      { name: 'Bachelor of Arts (B.A.)', degreeLevel: '2' },
      { name: 'Bachelor of Science (B.S.)', degreeLevel: '2' },
      { name: 'Bachelor of Fine Arts (BFA)', degreeLevel: '2' },
      { name: 'Bachelor of Applied Science (BAS)', degreeLevel: '2' },
      { name: 'Bachelor of Applied Arts and Science (BAAS)', degreeLevel: '2' },
      { name: 'Master of Arts (M.A.)', degreeLevel: '3' },
      { name: 'Master of Science (M.S.)', degreeLevel: '3' },
      { name: 'Master of Business Administration (MBA)', degreeLevel: '3' },
      { name: 'Master of Fine Arts (MFA)', degreeLevel: '3' },
      { name: 'Doctor of Philosophy (Ph.D.)', degreeLevel: '4' },
      { name: 'Juris Doctor (J.D.)', degreeLevel: '4' },
      { name: 'Doctor of Medicine (M.D.)', degreeLevel: '4' },
      { name: 'Doctor of Dental Surgery (DDS)', degreeLevel: '4' }
    ];



  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  //Filter for Field of Study Autocomplete
  applyFilterFields(evt: string): void {
    evt = evt + '';
    if (!evt) { this.fieldfilteredData = this.fieldoptions; }
    else {
      this.fieldfilteredData = this.fieldoptions.filter(item => (item + '') === evt || item.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0);
    }
  }

  //Filter for Institution Autocomplete
  applyFilterSchools(evt: string): void {
    evt = evt + '';
    if (!evt) { this.schoolfilteredData = this.schooloptions; }
    else {
      this.schoolfilteredData = this.schooloptions.filter(item => (item + '') === evt || item.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0);
    }
  }

  //Calendar Change Event to set Model
  onDateChange(event: MatDatepickerInputEvent<any>, control: AbstractControl): void {

    //this.model.awardedon = ((event.value.valueOf()).toString());

  }

  //Degree Completed Checkbox
  onCompletedChecked($event): void {
    if ($event.checked === true) { this.gradDate = 'Date of Completion'; }
    else { this.gradDate = 'Expected Graduation Date'; }
  }


  //Form Visibility Modifiers

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

  }

  onHideEditForm(): void {
    this.showedititem = false;

  }

  //State Dropdown Change Event
  onStateChange(ob): void {

    const selectedState = ob.value;
    console.log(selectedState);

    //TODO: Fill School Dropdown
  }


  //Change fileter of degree types based on degree level dropdown
  onDegreeLevelChanged(ob): void {

    this.degreetypesfilteredData = this.degreetypes.filter(degreetypes => degreetypes.degreeLevel === ob.value);

  }


  ngOnInit(): void {

    this.fieldfilteredData = this.fieldoptions;
    this.schoolfilteredData = this.schooloptions;
    this.degreetypesfilteredData = this.degreetypes;

    // this.degreelevels = this.db.object('/degreelevels').snapshotChanges();
    // this.degreelevels.subscribe(level => console.log(level));

    // this.degreelevels = this.db.object('/degreelevels').valueChanges()
    //   .subscribe((inp) => {
    //     this.degreelevels = inp;
    //     console.log(this.degreelevels);
    //   });


  }

}

// Empty Education class
export class Education {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,
    public institution: string,
    public completed: boolean,
    public awardedon: string,
    public major: string,
    public minor: string,

  ) { }

}

