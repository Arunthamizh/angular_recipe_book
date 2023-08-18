import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoggingService } from './logging.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private loggingService : LoggingService
  ){

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.authService.autoLogin();
    this.loggingService.printLog('Hello from appComponent ngOnInit()')
  }
}
