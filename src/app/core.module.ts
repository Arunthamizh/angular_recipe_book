import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthService } from './auth/auth.service';
import { RecipeService } from './recipes/recipe.service';
import { LoggingService } from './logging.service';
// * core module is used to split the servie form the app module
  // * and no need to export it because they are provided into the root
@NgModule({
  // provide maintain one service instance for all the time still app running
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true // By enable as true we allow to use multiple interceptor even we use one for now
  },
  // LoggingService
  ],
})
export class CoreModule {}
