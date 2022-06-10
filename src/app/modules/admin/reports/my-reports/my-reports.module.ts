import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MyReportsComponent } from './my-reports.component';
import { Route, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

const myreportsRoutes: Route[] = [
    {
        path     : '',
        component: MyReportsComponent
    }
];

@NgModule({
  declarations: [
    MyReportsComponent
  ],
  imports: [
    SharedModule,
    MatIconModule,
    RouterModule.forChild(myreportsRoutes)
  ]
})
export class MyReportsModule { }
