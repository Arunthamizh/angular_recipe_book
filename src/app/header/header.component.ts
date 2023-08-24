import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageService } from './../shared/data-storage-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.action'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
    ) {

     }

  ngOnInit() {
    this.userSub = this.store.select('auth')
    .pipe(map(authState =>  authState.user ))
    .subscribe((user) =>{
      this.isAuthenticated = !user ? false : true;
    });
  }

  onSaveData(){
    this.dataStorageService.storeRecipes()
  }

  onfetchData(){
    this.dataStorageService.fetchRecipies().subscribe(recipes => {

    })
  }

  onLogout(){
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout())
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSub.unsubscribe();
  }

}
