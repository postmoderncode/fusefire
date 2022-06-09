import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
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
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseConfirmationModule } from '@fuse/services/confirmation';


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
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    FuseAlertModule,
    FuseCardModule,
    FuseConfirmationModule,
    SharedModule,
    RouterModule.forChild(talenthobbiesRoutes)
  ]
})
export class TalentHobbiesModule { }
