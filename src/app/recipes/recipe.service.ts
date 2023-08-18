import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage-service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
@Injectable()
export class RecipeService {
    // recipeSelected = new EventEmitter<Recipe>();
recipeChanged = new Subject<Recipe[]>();
//  private recipes: Recipe [] = [
//         new Recipe( 1, 'Idly',
//         'This is the soft Idly',
//         'https://media1.thehungryjpeg.com/thumbs2/ori_3684573_u7fzfscx2tbxabtsapspty398dqj1mv1nztuhldq_df-monogram-logo-design.jpg',
//          [
//              new Ingredient('Rice', 1),
//              new Ingredient('Dall', 1)
//          ]),

//         new Recipe( 2, 'chapathi',
//         'this is chapathi',
//         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT402b_q0sAoXHY50z4R_yQsTDYoOVZs-pIiw&usqp=CAU',
//         [
//             new Ingredient('Wheet', 1),
//             new Ingredient('salt', 1)
//         ]
//         )
//       ];

    private recipes: Recipe[] =[]
  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>,
  ) {}

      setRecipes(recipes: Recipe[]){
        this.recipes = [...recipes];
        this.recipeChanged.next(this.recipes.slice());
      }

      getRecipes() {
          // get the copy of recipe return a new array which is an
          // ... exact copy of the one in this service file. it is private
          return this.recipes.slice();
      }

      getRecipe(id) {
        /* my solution */
        //   return this.recipes.find(
        //       (data) => {
        //         return data.id === id;
        //       }
        //   );

        /* Tutorial solution */
          return this.recipes.slice()[id];
      }
      addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
      }

      updateRecipe( index: number, newRecipe: Recipe) {
        console.log('updated', newRecipe)
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());

      }
      deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipeChanged.next(this.recipes.slice());
      }

}
