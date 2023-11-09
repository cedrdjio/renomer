import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Status } from '../models/misc/status';
import { ApiResponsePage } from '../models/response/api-response-page';
import {BehaviorSubject, Subscription} from "rxjs";

export abstract class AbstractComponent<T> {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: unknown;
  unsubscribe: Subscription[] = [];
  page = 0;
  limit = 25;
  submitted: boolean = false;
  addForm!: FormGroup;
  editForm!: FormGroup;
  data!: Observable<ApiResponsePage<T>>;
  status = Status;
  mode:string = "CREATE";
  isFilter: boolean = false;

  id!:string;

  term: string;

  searchForm!: FormGroup;

  get addFormControls() {
    return this.addForm.controls;
  }


  add() {
    throw new Error('Method not implemented.');
  }

  edit(id: string) {
    throw new Error('Method not implemented.');
  }

  activateOrDeactivate(item: any) {
    throw new Error('Method not implemented.');
  }

  delete(id: string) {
    throw new Error('Method not implemented.');
  }

  openModal(content: any) {
    throw new Error('Method not implemented.');
  }

  openEditModal(content: any, item: any) {
    throw new Error('Method not implemented.');
  }

  hideModal() {
    throw new Error('Method not implemented.');
  }

  export(): void {
    throw new Error('Method not implemented.');
  }

  showDetails(item: any): void {
    throw new Error('Method not implemented.');
  }

  showPos(item: any): void {
        throw new Error('Method not implemented.');
  }

  onPageChange(current: number) {
    throw new Error('Method not implemented.');
  }

  getAll() {
    throw new Error('Method not implemented.');
  }

    search(content: any): void {
        throw new Error('Method not implemented.');
    }

  loadScript(url:any) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
