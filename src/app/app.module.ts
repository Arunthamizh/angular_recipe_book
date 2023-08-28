import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store'; //* ngrx store
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
import { LoggingService } from './logging.service';
import { authReducer, state } from './auth/store/auth.reducer';
import * as fromAuth from '../app/store/app.reducer'
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RecipesEffects } from './recipes/store/recipe.effects'
import { RecipeService } from './recipes/recipe.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorPageComponent,
    // AuthComponet,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    HttpClientModule,
    // RecipeModule, // ! it was removed because it was loaded in lazyload
    // ShoppingListModule, // ! it was removed because it was loaded in lazyload
    SharedModule,
    // AuthModule,
    AppRoutingModule,
    // * setting up the NGRX store in application widely
    // * action reducer MAP( its a javascript object any identifer of your choise( here is "shoppingList"))

    // * below object is actionReducerMap object
    // StoreModule.forRoot({
    //   shoppingList: shoppingListReducer,
    //   auth: authReducer
    // }),

    //  below is the alternative and efficient way for above code
     StoreModule.forRoot( fromAuth.appReducer ),
    //  * need to register the effects below the storeModule
    EffectsModule.forRoot([AuthEffects, RecipesEffects]),
    StoreDevtoolsModule.instrument({logOnly:environment.production}),
    StoreRouterConnectingModule.forRoot(),
    CoreModule // * provided and service are moved to core module
  ],
  // // provide maintain one service instance for all the time still app running
  // * below code are moved to app core module
  // providers: [ShoppingListService, RecipeService, AuthService,{
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptorService,
  //   multi: true // By enable as true we allow to use multiple interceptor even we use one for now
  // }],
  // entryComponents:[AlertComponent], //  ! below angular 9 we need entry componts above to it we can omit it
  // providers:[LoggingService],
  providers: [RecipeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
