import { User } from '../user.model'
import * as  AuthActions  from './auth.action';

export interface state {
  user: User
}

const initialState: state = {
  user: null
};

// state ==> Doest care about other states,
// Action ==> Cate about all the redudcer in the store there fore default is very important

export function authReducer(state = initialState, action: AuthActions.AuthActions) {

  switch (action.type) {
    //  case 1
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );

      return {
        ...state,
        user: user
      };

    // case 2
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
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
