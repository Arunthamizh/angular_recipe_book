import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from '../store/auth.action'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expitationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expitationDate);
  localStorage.setItem('userData',JSON.stringify(user));
  return  new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate: expitationDate
  });
};

const handleError = (errorRes: any) => {
  let  errorMessage = 'An unknow error occurred';
  if(!errorRes.error || !errorRes.error.error){
    return of(new AuthActions.AuthenticateFail(errorMessage))
  }
  switch(errorRes.error.error.message){
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
  return of( new AuthActions.AuthenticateFail(errorMessage)); //* of() => return a new observable
};

export interface AuthResponseData {
  Kind:  string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}
// * @Injectable need to be here to so that things can be injected into AuthEffects
  // * we are injecting actions and Http_client
@Injectable()
//* Actions => is about one big observable that will give us access to all dispached actions.
export class AuthEffects {
//*  "$" sign is option but it denotes it an observable
  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router
  ){

  }

  //* action$  => no need to subscribe the action$ NGRX effects will subscribe for us.
  //*  For Example if the LOGIN_START action trigged then the  below action trigered for all other action it will

  @Effect() //*  @Effect() => Its an onging abservable stream
  authLogin = this.action$.pipe(
    // * ofType is used to check the type of action
    ofType(AuthActions.LOGIN_START),

    //* SwitchMap => creating a new observable based previous observable
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiiQ7oYIODm2yzWJxKA3HUDkLfNw-lgQ8',
      {
       email: authData.payload.email,
       password: authData.payload.password,
       returnSecureToken: true
      })
      .pipe(
        map( resData => {
        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
        }),
        catchError(errorRes =>  {
        // ...
        return handleError(errorRes)
      }),
      )
    })
  );

  //* when the effects doest not
  //* Effets() return an observable which holds a new effect
    //* which should be dispatched (like loginStart Action) like above
  //* Below Effect() does`nt and to let NGRX effects know about that and avoid errors
  @Effect({dispatch: false})
  authRedirect = this.action$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
    this.router.navigate(['/'])
    })
  )

  @Effect()
  autoLogin = this.action$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData :{
        email: string,
        id: string,
        _token: string,
        _tokExpirationDate: string

      } = JSON.parse(localStorage.getItem('userData'));
      if(!userData){
        return { type: 'Dummy'} // error its not a vailid action => Its important need to set like this when return ({ type: 'any text'})
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

          return  new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser._token,
            expirationDate: new Date (userData._tokExpirationDate)
          })
          // )
          // const expirationDuration =
          //   new Date (userData._tokExpirationDate).getTime() -
          //   new Date().getTime();
          // this.autoLogout(expirationDuration)
        }
        return { type: 'Dummy'}
    })
  )

  @Effect({dispatch: false})
  authLogout = this.action$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData')
    })
  )


  @Effect()
  authSingUp = this.action$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupData: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDiiQ7oYIODm2yzWJxKA3HUDkLfNw-lgQ8',
        {
        email: signupData.payload.email,
        password: signupData.payload.password,
        returnSecureToken: true
       })
       .pipe(
        map((resData: any)  => { return handleAuthentication(resData.expiresIn, resData.email, resData.localId, resData.idToken)}),
        catchError((errorRes) => { return handleError(errorRes)}),
        )
    })
  )

}
