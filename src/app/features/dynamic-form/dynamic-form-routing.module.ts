import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstants } from 'src/app/config/route-constants';
import { AnswersComponent } from './answers/answers.component';
import { BuilderComponent } from './builder/builder.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: RouteConstants.ROUTES.BUILDER,
    pathMatch: 'full',
  },
  {
    path: RouteConstants.ROUTES.BUILDER,
    component: BuilderComponent,
  },
  {
    path: RouteConstants.ROUTES.ANSWERS,
    component: AnswersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicFormRoutingModule {}
