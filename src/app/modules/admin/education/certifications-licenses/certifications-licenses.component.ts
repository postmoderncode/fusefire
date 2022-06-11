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
  options: string[] = ["Certified Public Accountant (CPA)", "Associate Chartered Certified Accountants (ACCA)", "Associate Accountant Technician (AAT)", "Certified Management Accountant (CMA)", "Certified Internal Auditor (CIA)", "Certified Fraud Examiner (CFE)", "Certification in Risk Management Assurance (CRMA)", "Chartered Global Management Accountant (CGMA)", "Certified Government Auditing Professional (CGAP)", "Certified Public Bookkeeping", "Certification in Control SeUCL lf-Assessment (CCSA)", "Certified Management Accountant", "Certified Financial Services Auditor (CFSA)", "Chartered Financial Analyst (CFA)", "Certified Anti-Money Laundering Specialist (CAMS)", "Certified Regulatory Compliance Manager (CRCM)", "ICA International Diploma in Compliance (ICAIDC)", "Certified Human Resources Professional (CHRP)", "Certificate in Training Practice (CTP)", "Certificate in Recruitment and Selection (CRS)", "Certificate in Personnel Practice (CPP)", "Certificate in Employment Relations, Law and Practice (CERLAP)", "Certified Information System Auditor (CISA)", "Microsoft Certified IT Professional (MCITP)", "Microsoft Certified Database Administrator (MCDBA)", "Microsoft Certified Desktop Support Technician (MCDST)", "Citrix Certified Associate – Visualization", "Citrix Certified Associate – Networking", "Citrix Certified Professional –Visualization", "CompTIA A+ (A+)", "CompTIA Network+ (Network+)", "CompTIA Security+ (Security+)", "Cisco Certified Network Associate (CCNA)", "Certified Network Professional (CCNP) Routing & Switching", "Certified Internet Web Associate", "European/International Computer Drivering License (ECDL/ICDL)", "Microsoft Certified Application Specialist (MCAS)", "Microsoft Technology Associate (MTA)", "Microsoft Certified Solutions Expert (MCSE)", "Microsoft Certified Solutions Associate (MCSA)", "Amazon Web Service (AWS) Certified Solutions Architect Certification", "Project Management in IT Security (PMITS)", "Certified Information Systems Security Pro (CISSP)", "Certified Information Security Manager (CISM)", "Puppet Certification Program", "ITIL v3 Foundation", "VMware Certified Professional 5 – Data Center Virtualization (VCP5-DCV)", "CompTIA Project+ certification", "Certificate in Insurance (CII)", "Certified Legal Manager (CLM)", "Accredited Legal Secretary (ALS)", "Professional Legal Secretary (PLS)", "Certified Business Manager (CBM)", "Project Management Professional (PMP)", "Certified Energy Manager (CEM)", "Certified Business Energy Professional (BEP)", "Financial Risk Manager (FRM)", "Professional Risk Manager (PRM)", "Associate Professional Risk Manager (APRM)", "SMEI Certified Professional Salesperson (SCPS)", "Certified Marketing Executive (CME)", "Certified Sales Executive (CSE)", "Certified Customer Service Representative (CCSR)", "Key Accountant Certification Program", "Certified Electronic Inspector", "Electromagnetic Compatibility Design Engineer", "Certified Dangerous Goods Professional", "Board Certified Environmental Engineer", "Fundamentals of Engineering (FE)", "Professional Engineering License", "Certified Maintenance & Reliability Professional", "Associate System Engineering Professional", "Certifications in engineering graphics", "Certified Technology Manager (CTM / CSTM)", "Quality Engineer certification (CQE)", "Certified Maintenance and Reliability Technician", "ISA Certified Automotive Professional", "IAPMO Mechanical Inspector", "Medical Gas Installer 6010", "Medical Gas Inspector 6020", "Medical Gas Verifier 6030", "Medical Gas Maintenance Personnel 6040", "Medical Gas Instructor 6050", "STAR HVACR Mastery", "STAR Plumbing Mastery", "STAR Fire Sprinklerfitting Mastery", "STAR Steamfitting-Pipefitting Mastery", "Title 24 Registry", "Certified Manufacturing Engineering", "Solar Heating Installer Certification", "Certified Reliability Engineer", "High-Performance Building Design", "Geometric Dimensioning & Tolerancing Professional – Technologist", "Test and Balance Engineer", "REHS Certification", "Environmental Health and Safety Professional Certificate", "Certified Safety Professional Certification (CSP)", "Associate Safety Professional (ASP)", "Graduate Safety Practitioner (GSP)", "Safety Management Specialist (SMS)", "Occupational Health and Safety Technologist (OHST)", "Construction Health and Safety Technician (CHST)", "Safety Trained Supervisor (STS)", "Certified Environmental, Safety and Health Trainer (CET)", "Safety Trained Supervisor Construction (STSC)", "National Registry of Environmental Professionals (NREP) Certifications", "Certified Special Event Professional (CSEP)", "Global Travel Professional Certification", "Certified Meeting Professional", "Digital Event Strategist Certification", "Certified Meeting Planning Program", "Professional in Human Resources (PHR)", "Senior Professional in Human Resources (SPHR)", "SHRM Certified Professional (SHRM-CP) ", "Professional in Human Resources — International (PRHi)", "SHRM Senior Certified Professional (SHRM-SCP)", "Global Professional in Human Resources (GPHR)", "Senior Professional in Human Resources — International (SPHRi)", "Certified in Risk and Information Systems Control (CRISC)", "Stanford Innovation and Entrepreneurship Certificate", "UCI Innovation & Product Development", "Harvard Innovation and Entrepreneurship Certificate", "MIT Innovation and Technology Certification Program", "Certified Law Enforcement Analyst (CLEA) program", "AMA Professional Certified Marketer (PCM) Marketing Management Certifications", "AMA Professional Certified Marketer (PCM), Digital Marketing Certifications", "Google Analytics", "Google Adwords Certification", "Hubspot Marketing Certifications - Inbound", "Hubspot Marketing Certifications - Email Marketing", "Hubspot Marketing Certifications - Content Marketing", "Hubspot Marketing Certifications - Marketing Software", "Hubspot Marketing Certifications - Hubspot Design", "Hubspot Marketing Certifications - Context Marketing", "Hubspot Marketing Certifications - Growth Driven Design", "Bing Ads Certificate", "Data & Marketing Association DMA Certification", "Content Marketing Institute Online Training and Certification", "DigitalMarketer Certified Content Marketing Specialist", "Facebook Blueprint ", "Code Academy HTML", "Copyblogger Certified Content Marketer", "Hootsuite Certification - Platform", "Hootsuite Certification - Social Marketing Certification", "Hootsuite Certification - Advanced Social Strategy", "Harvard Marketing Management Certification", "W3Schools Certification - HTML5", "W3Schools Certification - CSS", "W3Schools Certification - JavaScript", "W3Schools Certification - jQuery", "W3Schools Certification - PHP", "W3Schools Certification - XML", "Certified Addictions Registered Nurse (CARN)", "Certified Heart Failure Nurse", "Certified Gastroenterology Registered Nurse (CGRN)", "Certified Clinical Research Coordinator (CCRC)", "Certified Emergency Nurse (CEN)", "Certified Clinical Research Associate (CCRA)", "Association of Clinical Research Professionals", "Principal Investigator (CPI)", "IAAP Certified Administrative Professional (CAP)", "NCCB Administrative Assistant Certification (CAA)", "ASAP Administrative Certification of Excellence (PACE)", "Certified Medical Administrative Assistance (CMAA)", "UCI Clinical Research Certificate", "Certified Association in Project Management (CAPM)", "Master Project Manager (MPM)", "Certified Project Manager (CPM)", "Professional in Project Management (PPM)", "Agile DevOps Expert", "Certified ScrumMaster (CSM)", "Agile Scrum Foundation", "PMI-ACP Certification ", "Certified Scrum Product Owner (CSPO)", "Atlassian Certified Professional (ACP) ", "Certified Project Management Practitioner (CPMP)", "SAFe* Agilist Certification Training", "Global Association for Quality Management (GAQM)/ Associate in Project Management", "ASQ Quality Assurance Certifications - Biomedical Auditor", "ASQ Quality Assurance Certifications - Calibration Technician", "ASQ Quality Assurance Certifications - HACCP Food Safety Auditor", "ASQ Quality Assurance Certifications - Manager of Quality/Organizational Excellence", "ASQ Quality Assurance Certifications - Pharmaceutical GMP Professional", "ASQ Quality Assurance Certifications - Quality Auditor", "ASQ Quality Assurance Certifications - Quality Engineer", "Professional Research Certification", "Certified Professional Sales Person (CPSP)", "Accredited in Medical Sales (AMS)", "Amazon Web Services certification training", "Certified Sales Operations Professional (CSOP)", "Salesforce Certification - Administrator", "Salesforce Certification - Architect", "Salesforce Certification - Developer", "Salesforce Certification - Marketer", "Salesforce Certification - Consultant", "Consultative Sales Certification", "Certification in Consultative Sales Communication", "Certified Sales Leadership Professional (CSLP)", "Certification in Consultative Sales Strategies", "National Retail Federation Certification", "American Association of Sexuality Educators, Counselors and Therapist", "Board Certified Psychologist (ABPP)", "Approved Clinical Supervisor (ACS)", "American Association of Sexuality Educator, Counselors and therapists (ASSECT) Certified Sexuality Educator", "Certified Cognitive-Behavioral Therapist (CCBT)", "American Association of Sexuality Educator, Counselors and therapists (ASSECT) Certified Sexual Counselor", "Certified Rehabilitation Counselor (CRC)", "American Association of Sexuality Educators, Counselors and Therapist (ASSECT) Certified Sex Therapist", "Certified Group Psychotherapist (CGP)", "National Certified Addiction Counselor Level I (NCACI)", "Certified Gottman Therapist (CGR)", "Dialectical Behavior Therapist (DBT)", "Equine Assisted Psychotherapist (EAGALA)", "Eye Movement Desensitization and Reprocessing (EMDR)", "Licensed Marriage and Family Therapist (LMFT)", "Master Addictions Counselor (MAC)", "National Certified Addiction Counselor, Level II (NCACII)", "Music Therapist, Board Certified (MT-BC)", "Certified Clinical Mental Health Counselor (CCMHC)", "National Certified Counselor (NCC)", "Licensed Professional Counselor (LPC)", "National Certified Counselor (NCSC)", "Amazon Web Services (AWS) Certified Developer", "Oracle Application Express Developer Certification (Oracle APEX)", "Cloudera Certified Developer for Apache Hadoop (CCDH)", "Oracle Certified Professional, (OCP) MYSQL 5.6 Developer", "Oracle Certified Professional OCP Java SE Programmer, Java ME Mobile Application Developer", "Oracle Certified Associate (OCA) Java SE Programmer", "CIW- Web Foundation Associate", "CIW- Web Design Professional", "CIW- Web & Mobile Design Professional", "CIW- Web Development Professional", "Red Hat JBoss certified developer", "Puppet Labs Certification Program", "Salesforce Certified Developer & Advanced Developer", "Scrum Alliance Certified Scrum Developer (CSD)", "PMP Agile Certified Practitioner (PMI-ACP)", "Harvard Software Engineering Certificate", "Adobe certified expert (ACE) ", "Campaign Architect", "AEM 6 Developer", "AEM 6 Developer Practitioner", "AEM 6 Lead Developer", "AEM 6 Architect", "AEM Form Developer", "Campaign Business Practitioner"];

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
    if (picker === 'expire') {
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
