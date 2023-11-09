import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ResetPasswordComponent} from "./auth/components/reset-password/reset-password.component";

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    redirectTo:'admin',
    pathMatch: 'full'
  },
    {
        path: 'recover-password/:token',
        component: ResetPasswordComponent,
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
