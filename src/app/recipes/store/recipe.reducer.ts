import { state } from './../../auth/store/auth.reducer';
import { Recipe } from "../recipe.model"
import * as  RecipesAction  from "./recipe.action"
export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(
  state = initialState,
  action: RecipesAction.RecipesAction
  ){
  switch(action.type){
    case RecipesAction.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }

      case RecipesAction.ADD_RECIPE:
        return {
          ...state,
          recipes: [...state.recipes, action.payload]
        };

    case RecipesAction.UPDATE_RECIPE:
      const updateRecipe = {
        ...state.recipes[action.payload.index], // this will get the old recipe data
        ...action.payload.neRecipe // get the update recipes from the action that overwrite it
      }
      return {
        ...state,
        recipes: [...state.recipes, updateRecipe]
      }

    case RecipesAction.DELECTE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => { return index !== action.payload})
      };

      default:
      return {
        ...state
      }

  }


}
