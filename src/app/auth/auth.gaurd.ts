import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from 'rxjs/operators';
import * as formApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<formApp.AppState>
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      // * RXJS map operator is used to transform the observable inside the pipe operator

      // return this.authService.user.pipe(
        return this.store.select('auth').pipe(
        take(1), // ! take th latest authService.user value and then unsubscribe for this gaurd execution
        map(authState => { return authState.user}),
        map(user =>{
        // return !!user // convert fally value to fale and truiesj to ture
        const isAuth = !! user;
        if(isAuth){
          return true;
        }
        // ! this is the alternavite way for below method to redirect the user if not allowed
        return this.router.createUrlTree(['/auth'])

      }),

      // ! this is the old way we do it in above itself

      // tap(isAuth => {
      //   // * navigate the user if not allowed to the route
      //   if(!isAuth){
      //     this.router.navigate(['/auth']);
      //   }
      // })
      );
  }

}
