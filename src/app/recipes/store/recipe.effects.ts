import { pipe } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Effect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import * as RecipesAction from '../store/recipe.action'
import { map, switchMap } from 'rxjs/operators';


@Injectable()
export  class RecipesEffects {

  constructor(
    private http: HttpClient,
    private Action$: Actions

  ){
  }

  // @Effect()
  // fetchRecipes = this.Action$.pipe(
  //   ofType(RecipesAction.SET_RECIPES),
  //   switchMap((recipeData) => {
  //     return ''
  //   })
  // )
}
