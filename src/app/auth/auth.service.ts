import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

import * as AuthAction from '../auth/store/auth.action'

import * as fromApp from './store/auth.reducer'
import { Store } from '@ngrx/store';
export interface AuthResponseData {
  Kind:  string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenExperationTimer: any;
  // user = new Subject<User>();
  //! Subject - we get the user(data) whenever new data is emitted. but not able to get the value
    // ! that are emitted before

  user = new BehaviorSubject<User>(null);
  // ! BehaviorSubject -it gives acccess to the previously emitted value
     //! if they haven`t subscribed at the point of time that value was emitted (user data saved in the past time but we need user.token)



  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.state>
  ){

  }
  signup(email: String, password: String){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDiiQ7oYIODm2yzWJxKA3HUDkLfNw-lgQ8',
    {
      email,
      password,
      returnSecureToken: true
     })
     .pipe(catchError(this.handleError),
     tap(res  =>{
      this.handleAuthentication(
        res.email,
        res.localId,
        res.idToken,
        +res.expiresIn)
     })
     )
    //  .pipe(catchError((err) => {
    //   let  errorMessage = 'An error occurred';
    //   if(!err.error || !err.error.error){
    //     return throwError(errorMessage)
    //   }
    //   switch(err.error.error.message){
    //     case 'EMAIL_EXISTS':
    //       errorMessage = 'This email exists already';
    //       break;
    //     case 'Default':
    //       errorMessage = 'An new error!!'
    //       break
    //   };
    //   return throwError(errorMessage)
    //  }))
  }

  login(email: String, password: String){
     return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiiQ7oYIODm2yzWJxKA3HUDkLfNw-lgQ8',
     {
      email,
      password,
      returnSecureToken: true
     })
     .pipe(catchError(this.handleError),
     tap(res  =>{
      this.handleAuthentication(
        res.email,
        res.localId,
        res.idToken,
        +res.expiresIn)
     }))
  }

  private handleError(err: HttpErrorResponse){
    let  errorMessage = 'An unknow error occurred';
    if(!err.error || !err.error.error){
      return throwError(errorMessage)
    }
    switch(err.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correctss.';
        break;
    };
    return throwError(errorMessage)
  }


  autoLogin(){
    const userData :{
      email: string,
      id: string,
      _token: string,
      _tokExpirationDate: string

    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date (userData._tokExpirationDate)
      );
      if(loadedUser._token){
        //* changed to store functionality
        // this.user.next(loadedUser)
        this.store.dispatch(
          new AuthAction.Login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser._token,
          expirationDate: new Date (userData._tokExpirationDate)
        }))
        const expirationDuration =
          new Date (userData._tokExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration)
      }
  }

  logout() {
    // this.user.next(null);
    //* changed to store functionality
    this.store.dispatch(
      new AuthAction.Logout()
    )
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData') // remove particular data from localstage
    // localStorage.clear() // clear everthing from the localstorage
    if(this.tokenExperationTimer){
      clearTimeout(this.tokenExperationTimer);
    }
    this.tokenExperationTimer = null;
  }

  autoLogout(exirationDuration){
    console.log('exirationDuration',exirationDuration)
    this.tokenExperationTimer = setTimeout(() => {
      this.logout();
    },exirationDuration)
  }

  private handleAuthentication(email: string, userId: string,
    token: string, expiresIn: number){
    const expitationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expitationDate
      );
    //* changed to store functionality
    // this.user.next(user)
    this.store.dispatch(
      new AuthAction.Login({
      email: user.email,
      userId: user.id,
      token: user._token,
      expirationDate: expitationDate
    }))
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData',JSON.stringify(user));
  }
}
