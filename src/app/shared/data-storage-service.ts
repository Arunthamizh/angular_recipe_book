import { AuthService } from './../auth/auth.service';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { pipe, Subscriber } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators'
import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'}) // this is optinal type otherwise you need to include it in app modules providers array
// above is the recomended way for
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
    ) { }

  storeRecipes(){
    const recipe = this.recipeService.getRecipes();
    // put() overwrite method
     this.http.put('https://recipe-angular-udemy-course-default-rtdb.firebaseio.com/recipes.json', recipe)
     .subscribe((res) => {
      console.log('data storage',res)
     })
  }

  fetchRecipies(){
    return this.http.get<Recipe[]>('https://recipe-angular-udemy-course-default-rtdb.firebaseio.com/recipes.json')
    .pipe(
      map( recipes =>{
       return recipes.map( recipe => {
        return {... recipe , ingredients: recipe.ingredients ? recipe.ingredients : []}
        ;
      });
    }),
    tap( recipes =>{
      this.recipeService.setRecipes(recipes);
    }))
    // .subscribe((recipes) => {
    //    console.log('fetch data', recipes)

    // })
  }
  // new fetch modified from above
  // we set the header in interseptor so we not using the below funtion it for reference
  fetchRecipies_new() {
    // ! take is RXJS observerble that takes a argument
     //! for example "take(1)" 1 as argument I only want to take one value form that
     // ! observable and thereafter it will automatically unsubscribe

    //! exhaustMap it from RXJS it wait for 1st observable to complete
     //! which will happen after we took the latest user
     //! In exhaustMap method we passed function there we get the data form that previous observable
     //! and now we return a new observable in there which will then replace our previous observable in that entire observable chain

    // return this.authService.user.pipe((take(1), exhaustMap(user => {
      return this.store.select('auth').pipe(
        map(authState =>  authState.user),
        (take(1), exhaustMap(user => {
      return this.http.get<Recipe[]>('https://recipe-angular-udemy-course-default-rtdb.firebaseio.com/recipes.json',
      {
        params: new HttpParams().set('auth', user._token)
      })
    })),
      map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
            ;
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    )
  }
}
