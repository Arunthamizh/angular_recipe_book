import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from '../store/auth.action'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  Kind:  string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}
// * @Injectable need to here to so that things can be injected into AuthEffects
  // * we are injecting actions and Http_client
@Injectable()
// Actions => is about one big observable that will give us access to all dispached actions.
export class AuthEffects {
//  $ sign is option but it denotes it an observable
  constructor(
    private action$: Actions,
    private http: HttpClient
  ){

  }

  // action$  => no need to subscribe the action$ NGRX effedts will subscribe for us.
  //  For Example if the LOGIN_START action trigged then the  below action trigered for all other action it will

  @Effect() // Its an onging abservable stream
  authLogin = this.action$.pipe(
    ofType(AuthActions.LOGIN_START),
    // SwitchMap => creating a new observable based previous observale

    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiiQ7oYIODm2yzWJxKA3HUDkLfNw-lgQ8',
      {
       email: authData.payload.email,
       password: authData.payload.password,
       returnSecureToken: true
      })
      .pipe(
        map( resData => {
          const expitationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return of( new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expitationDate
          }));
        }),
        catchError(error =>  {
        // ...
        return of(); // of() => return a new observable
      }),
      )
    })
  )
}
