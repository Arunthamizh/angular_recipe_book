import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { LoggingService } from '../logging.service';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListAction from './store/shopping-list.actions';
import * as fromApp from '../../app/store/app.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  shoppingListServiceUnsubscribe: Subscription;
  // ingredients: Ingredient[] = [

  //   new Ingredient('apple', 5),
  //   new Ingredient('Tomatoes', 10),
  // ];
  constructor(
    private loggingService: LoggingService,
    //! below the shopping list store is Injected
    // private store: Store <{shoppingList: {ingredients: Ingredient[]}}> // * now we are using type below
    private store: Store <fromApp.AppState>
  ) { }

  ngOnInit(): void {
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.shoppingListServiceUnsubscribe = this.shoppingListService.ingredientChanged.subscribe(( ingredent1) => {
    //   this.ingredients  = ingredent1;
    // });

    // ! use the store here and want to get access to the ingredients stored in the store
    this.ingredients = this.store.select('shoppingList')
    this.loggingService.printLog('Hello from shopping  list component ngOnInit()')
  }

  // onIngredientAdded(data: Ingredient) {
  //   this.ingredients.push(data);

  // }
  onEditItem(item, index: number) {
    // this.shoppingListService.editIndex.next(index);
    this.store.dispatch( new ShoppingListAction.StartEdit(index))
  }

  ngOnDestroy() {
    // this.shoppingListServiceUnsubscribe.unsubscribe();
  }
}
