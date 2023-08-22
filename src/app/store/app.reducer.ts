import * as formShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  shoppingList: formShoppingList.State,
  auth: fromAuth.state
}

//*  any action that dispached from the reducer that always reached all other reducers in the store

// Here we are using action reducer map file instead of using it in the appModule
export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: formShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer
}
