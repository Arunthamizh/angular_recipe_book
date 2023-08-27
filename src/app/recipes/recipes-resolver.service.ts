import { of, pipe } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { RecipeService } from './recipe.service';
import { DataStorageService } from './../shared/data-storage-service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.action';
import { Actions, ofType } from '@ngrx/effects'
import { map, switchMap, take } from 'rxjs/operators';
// it is used to fix the problem when page gets refresh
// we losed the recipe data so we check recipe data is available else fetch it
@Injectable({ providedIn: 'root'})
export class RecipesResolverService implements Resolve <Recipe[]>{
  constructor(private DataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
    ){}
  // * no need to .subscribe() the fetchRecipies method the 'resolve' angular feature
  // will subscribe for us once the data is there
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const recipes = this.recipeService.getRecipes()
    if(recipes.length === 0 ){
    // return this.DataStorageService.fetchRecipies();


    // edited recepies are override by fetching from the server
  return   this.store.select('recipes').pipe(
      take(1),
      map((recipesState:any) => {  return recipesState.recipes}),
      switchMap((recipes) => {
        if(recipes.length === 0){

          this.store.dispatch( new RecipeActions.FetchRecipes())
          // below action.pipe and ofType() is now listen to the sepecfic action
            return this.actions.pipe(
              ofType(RecipeActions.SET_RECIPES, take(1))
            )

        } else{
          return of(recipes)
        }
      })
    )

    } else {

    }
  }
}
