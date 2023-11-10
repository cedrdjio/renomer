import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './template/components/index/index.component';
import {BoardComponent} from "./configuration/components/board/components/board.component";
import {UserComponent} from "./configuration/components/users/user.component";
import {CountryComponent} from "./configuration/components/country/country.component";
import {ClientComponent} from "./configuration/components/clients/client.component";
import {PosComponent} from "./configuration/components/pos/pos.component";
import {PartnerComponent} from "./configuration/components/partner/partner.component";
import {PartnerUserComponent} from "./configuration/components/partner/partner-users/partner-user.component";
import {PartnerPosComponent} from "./configuration/components/partner/partner-pos/partner-pos.component";
import { CategoryComponent } from './configuration/components/category/category.component';
import { ProductComponent } from './configuration/components/product/product.component';



const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: BoardComponent,
      },

      {
            path: 'countries',
            component: CountryComponent,
      },
      {
            path: 'partners',
            component: PartnerComponent,
      },

      {
            path: 'partners/:id',
            component: PartnerUserComponent,
      },
        {
            path: 'partners-pos/:id',
            component: PartnerPosComponent,
        },
      {
        path: 'users',
        component: UserComponent,
      },
      {
        path: 'categories',
        component: CategoryComponent,
      },
      {
        path: 'produits',
        component: ProductComponent,
      },
      {
            path: 'clients',
            component: ClientComponent,
      },
      {
            path: 'pos',
            component: PosComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
