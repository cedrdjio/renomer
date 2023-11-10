import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Observable } from 'rxjs';
import {Role} from "../../models/misc/role.enum";
import {Status, UserStatus} from "../../models/misc/status";

import {environment} from "../../../../environments/environment";


@Component({
    selector: 'app-default-table',
    templateUrl: './default-table.component.html',
    styleUrls: ['./default-table.component.scss'],
})
export class DefaultTableComponent implements OnInit {
    @Input() columns!: Column[];
    @Input() values!: Observable<any>;
    @Input() isEditable = false;
    @Input() isHideable = false;
    @Input() isDeletable = false;
    @Input() hasDetails = false;
    @Input() hasPos = false;
    @Input() isSendLink = false;
    @Input() isOnlyForRoot = false;
    @Input() isBlockable = false;
    @Input() page = 1;
    @Input() pageSize = 10;
    @Input() editRef!: any;
    @Input() deleteRef!: any;
    @Input() sendRef!: any;
    @Input() idRef = 'id';

    @Output() onPageChangeEvent = new EventEmitter<number>();
    @Output() onEdit = new EventEmitter<ModalValue>();
    @Output() onDelete = new EventEmitter<ModalValue>();
    @Output() onHide = new EventEmitter<any>();
    @Output() onShowDetails = new EventEmitter<any>();
    @Output() onShowPos = new EventEmitter<any>();
    @Output() onSendLink = new EventEmitter<any>();

    hasOptions = false;
    generalStatus = Status;
    userStatus = UserStatus;
    role = Role;

    firstColumn!: string;
    mColumns = new Array<Column>();

    base_url = environment.baseUrl;

    loadScript(url: any) {
        const body = <HTMLDivElement>document.body;
        const script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = false;
        script.defer = true;
        body.appendChild(script);
    }

    ngOnInit(): void {
        this.loadScript('../../../../assets/js/jquery-3.5.1.min.js');
        this.loadScript(
            '../../../../assets/js/bootstrap/bootstrap.bundle.min.js'
        );
        this.loadScript(
            '../../../../assets/js/icons/feather-icon/feather.min.js'
        );
        this.loadScript(
            '../../../../assets/js/icons/feather-icon/feather-icon.js'
        );
        this.loadScript('../../../../assets/js/scrollbar/simplebar.js');
        this.loadScript('../../../../assets/js/scrollbar/custom.js');
        this.loadScript('../../../../assets/js/config.js');
        this.firstColumn = this.columns[0].name;
        this.mColumns[0] = this.columns[0];
        for (let index = 0; index < this.columns.length; index++) {
            this.mColumns[index] = this.columns[index];
        }
        this.columns.shift();

        this.hasOptions =
            this.isEditable ||
            this.isDeletable ||
            this.isHideable ||
            this.hasDetails ||
            this.isSendLink ||
          this.isOnlyForRoot ||
            this.isBlockable;
    }

    /**
     * Event emit when page change
     * @param current current page
     */
    onPageChange(current: number) {
        this.onPageChangeEvent.emit(current);
    }

    /**
     * Edit event
     * @param content a ref and an object
     */
    edit(val: any) {
        this.onEdit.emit({ ref: this.editRef, content: val });
    }

    /**
     * Edit event
     * @param content a ref and an object
     */
    send(val: any) {
        this.onSendLink.emit({ ref: this.sendRef, content: val });
    }

    /**
     * Delete Event
     * @param content a ref and an object
     */
    delete(val: any) {
        this.onDelete.emit({ ref: this.deleteRef, content: val });
    }

    /**
     *
     * @param val
     */
    hideOrShow(val: any) {
        this.onHide.emit(val);
    }

    showDetails(val: any) {
        this.onShowDetails.emit(val);
    }

    showPos(val: any) {
        this.onShowPos.emit(val);
    }

    download(fileName: string): string {
        return environment.baseUrl + fileName;
    }
}

export class Column {
  constructor(public name: string, public propertyName: string) {}
}

export class ModalValue {
  constructor(public ref: any, public content: any) {}
}
