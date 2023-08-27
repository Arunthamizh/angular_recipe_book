import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = '[Recipes] set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch  Recipes';
export const ADD_RECIPE = '[Recipes] Add Redipes';
export const UPDATE_RECIPE = '[Recipes] Update Recipe';
export const DELECTE_RECIPE = '[Recipes] Delete Recipe';
export const STORE_RECIPES = '[Recipes] Store Recipes'

export class SetRecipes implements Action{
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]){

  }
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action{
  readonly type = ADD_RECIPE;
  constructor(
    public payload: Recipe
  ){}
}

export class UpdateRecipe implements Action{
  readonly type = UPDATE_RECIPE;
  constructor(
    public payload: { index: number; neRecipe: Recipe}
  ){}
}

export class DeleteRecipe implements Action{
  readonly type = DELECTE_RECIPE;
  constructor(
    public payload: number
  ){}
}

export class StoreRecipes implements Action{
  readonly type = STORE_RECIPES;
  constructor(

  ){}
}

export type RecipesAction = SetRecipes | FetchRecipes | AddRecipe | UpdateRecipe| DeleteRecipe
| StoreRecipes;
