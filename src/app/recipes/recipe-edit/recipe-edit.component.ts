import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from "../../store/app.reducer";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  get  ingredientsControl(){
    //! as FormArray means return a formArray .controls not through error
    return (this.recipeForm.get('ingredients') as FormArray) .controls;
  }
  constructor( private route: ActivatedRoute,
               private recipeService: RecipeService,
               private router: Router,
               private store: Store<fromApp.AppState>
              ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = + params.id;
        this.editMode = params.id != null;
        console.log(this.editMode);
        this.initForm();
      }
    );
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value.id,
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.recipeImage,
      this.recipeForm.value.ingredients,
    );
    console.log('editRecipe', this.recipeForm);
    if (this.editMode) {
      console.log('before edit save', newRecipe)
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
    this.recipeService.addRecipe(newRecipe);
    }
  }

  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      const recipe =   this.store.select('recipes').pipe(
        map((recipeState) => {
          return recipeState.recipes.find((recipe, index)=> {
            return index === this.id;
          })
        })
      ).subscribe((recipe)=> {
        recipeName = recipe.name;
        recipeImage = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe.ingredients) {
          for ( const ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ingredient.name, Validators.required),
                amount: new FormControl(ingredient.amount, [
                   Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      })

    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      recipeImage: new FormControl(recipeImage, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }
  onAddIngredient() {
    const ingredient: Ingredient = {
      name: 'dsfs',
      amount: 4
    };
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
           Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }
  onCancel() {
    // this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onDeleteIngredient(i) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(i);
  }
  }


