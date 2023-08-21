import { User } from '../user.model'
import * as  AuthActions  from './auth.action';

export interface state {
  user: User
}

const initialState: state = {
  user: null
};

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
    default:

    return state
  }


}
