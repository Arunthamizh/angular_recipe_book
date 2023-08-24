import { User } from '../user.model'
import * as  AuthActions  from './auth.action';

export interface state {
  user: User,
  authError: string,
  isLoading: boolean,
}

const initialState: state = {
  user: null,
  authError: null,
  isLoading: false
};

// state ==> Doest care about other states,
// Action ==> Cate about all the redudcer in the store there fore default is very important

export function authReducer(state = initialState, action: AuthActions.AuthActions) {

  switch (action.type) {
    //  case 1
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );

      return {
        ...state,
        user: user,
        isLoading: false
      };

    // case 2
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        isLoading: false
      }

    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
    return{
      ...state,
      authError: null,
      isLoading: true
    };

    case AuthActions.AUTO_LOGIN:
      return{
        ...state
      }
    case AuthActions.AUTHENTICATE_FAIL:
      return{
        ...state,
        user: null,
        authError: action.type,
        isLoading: false
      }
    case AuthActions.CLEAR_ERROR:
      return{
        ...state,
        authError: null
      }

    // case default;
    //* The defaulat cause is important
    //* Any action that dispached action from the reducer that always reached all other reducers in the store.
    // For example the shopping list reducer is called then the auth reducer is trigger
      // -- it will not true for the swith case mention at that time the default case is used.
    default:
    return state
  }
}
