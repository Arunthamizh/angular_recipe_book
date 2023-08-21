import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer'
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  editMode = false;
  // editItemIndex: number;
  toEditItem: Ingredient;
  @ViewChild('editShopping', { static: false}) editInputRef: NgForm;
  subscription: any;
//  @Output() added = new EventEmitter<{name: string, amount: number}>();
//  @Output() added = new EventEmitter<Ingredients>();

//  Ingredients
//  @ViewChild('nameInput', {static: true}) nameInputRef: ElementRef;

//  @ViewChild('amountInput', {static: true}) amountInputRef: ElementRef;
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {

  // this.shoppingListService.editIndex.subscribe(
  //   (index: number) => {
  //     this.editMode = true;
  //     this.editItemIndex = index;
  //     this.toEditItem = this.shoppingListService.getIngredient(index);
  //     this.editInputRef.setValue({
  //       name: this.toEditItem.name,
  //       amount: this.toEditItem.amount
  //     });
  //   }
  // );

  //*  new way by using NGRX store
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.toEditItem = stateData.editedIngredient;
          // this.editItemIndex = stateData.editedIngredientIndex;
          this.toEditItem && this.editInputRef.setValue({
            name: this.toEditItem.name,
            amount: this.toEditItem.amount
          });
        } else {
          this.editMode = false;
        }
      });

  }
  onClear() {
    this.editInputRef.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onDelete() {
    // this.shoppingListService.onDeleteIngredients(this.editItemIndex);

    // this.store.dispatch(
    //   new ShoppingListActions.DeleteIngredient({
    //     index: this.editItemIndex
    //   })
    // )

    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient()
    );

    this.onClear();
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(newIngredient, this.editItemIndex);
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
        )

        // new ShoppingListActions.UpdateIngredient({
        //   // index: this.editItemIndex,
        //   // ingredient: newIngredient
        // })
    } else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.onClear();
    // const name = this.nameInputRef.nativeElement.value;
    // const amount = +this.amountInputRef.nativeElement.value;

    // const newIngredient = new Ingredient(name, amount);
    // //this.added.emit(newIngredient);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
