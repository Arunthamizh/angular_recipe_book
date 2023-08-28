import { Component, OnInit } from '@angular/core';
// import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  // below provider it means all the component share the same instance
    // but we navigate away to shopping list area the recipe component is destroyed
     // so we are going to include it in the app module
    // providers: [RecipeService]
})
export class RecipesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
}
}

