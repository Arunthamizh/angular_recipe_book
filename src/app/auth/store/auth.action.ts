import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login start';
export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN';
export const AUTHENTICATE_FAIL = '[Auth] Login Error';

export const SIGNUP_START = '[auth] SignUp Start';
// export const SIGN_UP = '[Auth] Sign Up';
export const LOGOUT = '[Auth] LOGOUT';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const CLEAR_ERROR = '[Auth] Clear Error';

// export const LOGIN_SUCCESS = '[Auth] Login Success';

export class AuthenticateSuccess  implements Action {
  readonly  type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date
    }
  ){}
}


export class Logout implements Action{
  readonly type = LOGOUT;
}

export class LoginStart implements Action{
  readonly type = LOGIN_START

  constructor(
    public payload: {
      email: string,
      password: string
    }
  ){}

}

export class AuthenticateFail implements Action{

  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class AuthoLogin implements Action {
  readonly type = AUTO_LOGIN
}

export class SignupStart implements Action{
  readonly type = SIGNUP_START
  constructor(public payload: { email: string; password: string }) {}
}

export class ClearError implements Action{
readonly type = CLEAR_ERROR
}


export type AuthActions =
| SignupStart
| AuthenticateSuccess
| Logout
| LoginStart
| AuthenticateFail
| ClearError
| AuthoLogin;


//  action => Reducer => action
