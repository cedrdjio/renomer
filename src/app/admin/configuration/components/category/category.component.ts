import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent extends AbstractComponent<Category> implements OnInit{

    category$: Observable<ApiResponsePage<Category>>;

    constructor(private loaderService: LoaderService,
                private categoryService: CategoryService) {
        super();
    }

    ngOnInit(): void {
        this.reloadCategories();
    }


    reloadCategories() {
        const category$ = this.categoryService.getAllPaginated(this.term, this.page, this.limit);
        this.category$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Category>>(category$);
    }
}
