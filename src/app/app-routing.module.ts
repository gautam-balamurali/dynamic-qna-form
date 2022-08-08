import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './config/route-constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: RouteConstants.ROUTES.FORM,
    pathMatch: 'full',
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./features/dynamic-form/dynamic-form.module').then(
        (mod) => mod.DynamicFormModule
      ),
  },
  { path: '**', redirectTo: RouteConstants.ROUTES.FORM },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
