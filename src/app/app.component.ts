import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {LoadingBarService} from "@ngx-loading-bar/core";
import { map, delay, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sendRate-admin';


    // For Progressbar
    loaders = this.loader.progress$.pipe(
        delay(1000),
        withLatestFrom(this.loader.progress$),
        map(v => v[1]),
    );

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private loader: LoadingBarService) {

    }

}
