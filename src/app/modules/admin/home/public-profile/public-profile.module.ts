import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { PublicProfileComponent } from './public-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FuseCardModule } from '@fuse/components/card';


const publicprofileRoutes: Route[] = [
  {
    path: '',
    component: PublicProfileComponent
  }
];

@NgModule({
  declarations: [
    PublicProfileComponent
  ],
  imports: [
    SharedModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    FuseCardModule,
    RouterModule.forChild(publicprofileRoutes)
  ]
})
export class PublicProfileModule { }
