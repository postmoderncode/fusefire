import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GlobalSettingsComponent implements OnInit {

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  ngOnInit(): void {



  }

}
