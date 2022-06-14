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
  model = new Education('', '', '', '', '', '', '', '', '', '');

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;

  //Autocomplete Data
  schoolfilteredData;
  fieldfilteredData;

  schooloptions: string[] = ['Ball State University', 'Indiana University', 'Notre Dame', 'Purdue University', 'Indiana Tech'];
  fieldoptions: string[] = ['Accounting', 'Advertising', 'African-American Studies', 'Agriculture', 'Animal Science', 'Anthropology', 'Aerospace Engineering', 'Archaeology', 'Architecture', 'Art History', 'Arts Management', 'Asian-American Studies', 'Astronomy and Astrophysics', 'Bilingual/Crosscultural Education', 'Athletic Training', 'Biochemistry', 'Biology', 'Biomedical Engineering', 'Business', 'Chemical Engineering', 'Chemistry', 'Civil Engineering', 'Classical Studies', 'Communication Disorders Sciences and Services', 'Communications', 'Comparative Literature', 'Computer Engineering', 'Computer Information Systems', 'Computer Science', 'Construction Services', 'Cosmetology Services', 'Creative Writing', 'Criminology', 'Culinary Arts', 'Cybersecurity', 'Design', 'Economics', 'Education', 'Electrical Engineering', 'Elementary Education', 'Engineering', 'English Language and Literature', 'Entomology', 'Environmental Engineering', 'Film and Video Production', 'Film-Video Arts', 'Finance', 'Fine Arts', 'Fire Safety Science', 'Food Science', 'Foreign Languages', 'Forestry', 'Gender Studies', 'Genetics', 'Geology', 'Graphic Design', 'Health Sciences', 'History', 'Hospitality Management', 'Human Ecology', 'Industrial Technology', 'International Business', 'International Relations', 'Journalism', 'Kinesiology', 'Latin American Studies', 'Liberal Studies', 'Library Science', 'Linguistics', 'Logistics Management', 'Marketing', 'Mathematics', 'Mechanical Engineering', 'Medical Technology', 'Metallurgical Engineering', 'Meteorology', 'Microbiology', 'Military Technology', 'Mining and Mineral Engineering', 'Music', 'Mythology and Folklore', 'Naval Architecture and Marine Engineering', 'Neuroscience', 'Nuclear Engineering', 'Nursing', 'Oceanography', 'Occupational Health and Safety', 'Parks, Recreation, and Leisure Studies', 'Performing Arts', 'Petroleum Engineering', 'Pharmacology', 'Philosophy', 'Photography', 'Physics', 'Physiology', 'Plant Science', 'Political Science', 'Pre-Law', 'Psychology', 'Public Administration', 'Puppetry', 'Religious Studies', 'Rhetoric', 'Social Work', 'Sociology', 'Software Engineering', 'Special Education', 'Sports Medicine', 'Statistics', 'Student Counseling', 'Supply Chain Management', 'Theater Arts', 'Viticulture', 'Zoology']

  degreelevels =
    [
      { id: '1', name: 'Associate' },
      { id: '2', name: 'Bachelors' },
      { id: '3', name: 'Masters' },
      { id: '4', name: 'Doctorate' }
    ];

  //degreelevels;

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

  degreetypesfilteredData;

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
    if (!evt) {this.fieldfilteredData = this.fieldoptions;}
    else {
      this.fieldfilteredData = this.fieldoptions.filter(item => (item + '') === evt || item.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0);
    }
  }

  //Filter for Institution Autocomplete
  applyFilterSchools(evt: string): void {
    evt = evt + '';
    if (!evt) {this.schoolfilteredData = this.schooloptions;}
    else {
      this.schoolfilteredData = this.schooloptions.filter(item => (item + '') === evt || item.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0);
    }
  }

  //Calendar Change Event to set Model
  onDateChange(event: MatDatepickerInputEvent<any>, control: AbstractControl): void {

    //this.model.awardedon = ((event.value.valueOf()).toString());

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
    public awardedon: string,
    public major: string,
    public minor: string,

  ) { }

}

