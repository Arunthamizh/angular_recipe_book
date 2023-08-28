import { FETCH_RECIPES } from './recipe.action';
import { pipe } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Effect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import * as RecipesAction from '../store/recipe.action'
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer'
import { Store } from '@ngrx/store';


@Injectable()
export  class RecipesEffects {

  constructor(
    private http: HttpClient,
    private Action$: Actions,
    private store: Store<fromApp.AppState>

  ){
  }

  @Effect()
  fetchRecipes = this.Action$.pipe(
    ofType(RecipesAction.FETCH_RECIPES),
    switchMap(() => {
      return this.http
      .get<Recipe[]>(
        'https://recipe-angular-udemy-course-default-rtdb.firebaseio.com/recipes.json'
      )
    }),
    map((recipes: any) => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map((recipes: any) => {
      return new RecipesAction.SetRecipes(recipes)
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.Action$.pipe(
    ofType(RecipesAction.STORE_RECIPES),
    //  it allow to merge the value from other observable into this observable stream
    //  we are getting the recipe form the store using the selector
    withLatestFrom(this.store.select('recipes')), // withLatestFrom() => its output as an array. Rxjs gives us this array it holds actions(actionData)
                      // and also latest from that will be our recipes
    switchMap(([actionData, recipeState]) =>{
      return   this.http.put('https://recipe-angular-udemy-course-default-rtdb.firebaseio.com/recipes.json',
      recipeState.recipes)

    })
  )
}
