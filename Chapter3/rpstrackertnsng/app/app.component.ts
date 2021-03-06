import { Component } from '@angular/core';
import { Page } from 'ui/page';
import { device } from 'platform';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from './core/services';
import { Store } from './core/state/app-store';
import { PtItem } from './core/models/domain';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html',
})
export class AppComponent {

    constructor(
        private page: Page,
        private store: Store,
        private translateService: TranslateService,
        private loggerService: LoggerService
    ) {
        console.log('app component constructor');
        page.actionBarHidden = true;
        page.backgroundSpanUnderStatusBar = true;

        translateService.setDefaultLang('en');
        translateService.use(device.language);
    }

    public throwError(args) {
        throw new Error('Error from component');
    }

}
