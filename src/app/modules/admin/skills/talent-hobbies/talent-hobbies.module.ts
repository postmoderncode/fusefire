import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentHobbiesComponent } from './talent-hobbies.component';
import { Route, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';

const talenthobbiesRoutes: Route[] = [
  {
    path: '',
    component: TalentHobbiesComponent
  }
];


@NgModule({
  declarations: [
    TalentHobbiesComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    FuseAlertModule,
    SharedModule,
    RouterModule.forChild(talenthobbiesRoutes)
  ]
})
export class TalentHobbiesModule { }
