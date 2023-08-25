import { AuthoLogin } from './auth/store/auth.action';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoggingService } from './logging.service'
import { Store } from '@ngrx/store';
import * as fromApp from '../app/store/app.reducer'
import * as AuthActions from '../app/auth/store/auth.action'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private loggingService : LoggingService
  ){

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // this.authService.autoLogin();
    this.store.dispatch( new AuthActions.AuthoLogin())
    this.loggingService.printLog('Hello from appComponent ngOnInit()')
  }
}
