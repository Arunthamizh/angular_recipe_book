import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

// 
export interface State {
  ingredients : Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}


// application state
export interface AppState {
  ShoppingList: State
}

const initialState: State = {
  ingredients:  [
    new Ingredient('apple', 5),
    new Ingredient('Tomatoes', 10),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};
// (state = initialState) it means set default value to the parameter if it Nulll or undefined
// * Reducer contains two parameter STATE, ACTION
// * :Action is a interface
export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
  ) {
  switch (action.type) {
    // * best practice to use upper_case;
    // ! state.ingredients.push  ==>  it is totally wrong we don`t edit the existing state or previous state
    // ! always copy the old state
    // ! state are immutable
    case ShoppingListActions.ADD_INGREDIENT:
    return {
        ...state, // * always copy the old state using spread operator
      ingredients: [...state.ingredients, action.payload] // * overwrite the ingredients now
                // * copy old ingredient first and then add the new ingredient with it
    };
    
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      // 1 * get old value of the Ingredient
      const ingredient = state.ingredients[state.editedIngredientIndex]; 

      // 2 * update the new value 
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      }

      // 3 * fetch all the ingredient and update modified data with index value
      const updatedIngredients = [...state.ingredients]
      updatedIngredients[state.editedIngredientIndex] =  updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        // editedIngredientIndex:  -1,
        editedIngredient: null,
        ingredients: state.ingredients.filter( (ig, index) => {
           return index != state.editedIngredientIndex
        }
        )
      };

    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient : { ...state.ingredients[action.payload]}
      };
    
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}
