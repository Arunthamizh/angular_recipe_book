import { User } from '../user.model'

export interface state {
  user: User
}

const initialState: state = {
  user: null
};

export function authReducer(state = initialState, action) {
  return state
}
