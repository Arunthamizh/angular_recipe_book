import * as formShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRecipes from "../recipes/store/recipe.reducer";
// toots to look the NGRS Store
// 1. Redux devtools extension
    // after install dev tools then install the dev dependecy package
    // usefull package for dev
    // 1st package
    // * npm i --save-dev @ngrx/store-devtools
    //  --legacy-peer-deps
    // after insalled the ngrx/store-devtools package need to add the package in app.module.ts
    // like this =>  StoreDevtoolsModule.instrument({logOnly:environment.production})
    //  2rt package
    // This package provide more infomation  @ngrx/router-store
    //  npm i @ngrx/router-store



export interface AppState {
  shoppingList: formShoppingList.State,
  auth: fromAuth.state,
  recipes: fromRecipes.State
}

//*  any action that dispached from the reducer that always reached all other reducers in the store

// Here we are using action reducer map file instead of using it in the appModule
export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: formShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipeReducer
}
