import { Ingredient } from 'src/app/shared/ingredient.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
// import { RecipeService } from '../recipe.service';
import * as fromApp from "../../store/app.reducer";
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.action';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detal.component.html',
  styleUrls: ['./recipe-detal.component.css']
})
export class RecipeDetalComponent implements OnInit {
 SelectedDtails: any;
  id: number;

  constructor(
    //  private recipeService: RecipeService,
               private route: ActivatedRoute,
               private router: Router,
               private store: Store<fromApp.AppState>
              ) { }

  ngOnInit() {

    /* 1. The router snapshot will work for component loaded at first time  */
    /* 2. it means it work at when loaded newly at first in DOM not able to get the params when reuse the component*/
    /* 3. so we are using a Observables and subscribe method  for component reuse*/

    // option 1
    // const id = this.route.snapshot.params.id;

    // option 2
    this.route.params.pipe(
      map((params) => { return +params['id'];}),
      switchMap((id) => {
        this.id = +id;
        return   this.store.select('recipes')
      }),
      map((recipesState) => {
        return  recipesState.recipes.find((recipe, index) =>{
          return index === this.id
        })
      })
    )
    .subscribe((data) => {
      this.SelectedDtails = data
    })

  }
  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.SelectedDtails.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredient(this.SelectedDtails.ingredients))
  }
  onDelete() {
    //  this.recipeService.deleteRecipe(this.id);
    this.store.dispatch( new RecipeActions.DeleteRecipe(this.id))
     this.router.navigate(['../'], { relativeTo: this.route});
  }
}
