import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Router } from '@angular/router';
import { AuthResponseData, AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
@Component({
  selector:'app-auth',
  templateUrl:'./auth.component.html'
})

export class AuthComponet {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  closeSub: Subscription

   // !  it find where we use that directive in the template of this component
   @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ){}
  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;

  }

  onSubmit(form:NgForm){
    console.log('auth form', form.value);
    if(!form.valid){
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode){
      authObs = this.authService.login(email, password)
      // .subscribe(
      //   (response)=>{
      //     console.log('signup', response);
      //     this.isLoading = false;

      //   },
      //   (err)=>{
      //     console.log('signup err', err);
      //     this.isLoading = false;
      //     this.error = err;
      //   })
    }else {
      authObs = this.authService.signup(email, password)
      // .subscribe(
      //   (response)=>{
      //     console.log('signup', response);
      //     this.isLoading = false;

      //   },
      //   (err)=>{
      //     // switch(err.error.error.message){
      //     //   case 'EMAIL_EXISTS':
      //     //     this.error = 'This email exists already';
      //     //   case 'default':
      //     //   this.error = 'An error occurred';
      //     // };

      //     console.log('signup err', err);
      //     this.isLoading = false;
      //     this.error = err;
      //   })
    }
    authObs.subscribe(
      (response)=>{
        if(!response){
          return ;
        }
        console.log('signup', response);
        this.isLoading = false;
        this.router.navigate(['/recipes'])

      },
      (errorMessage)=>{
        console.log('signup err', errorMessage);
        this.showErrorAlert(errorMessage)
        this.isLoading = false;
        this.error = errorMessage;
      })
    form.reset();

  }

  onHandleError(){
    this.error = null
  }

  private showErrorAlert(errorMessage: string){
  // const alertComp = new AlertComponent(); // ! not able to create a componet like this

    // ! below is the alternative way for *nfIf dynamic component programmatically
    // ! dynamically load the component using alternative way of ComponentFactoryResolver

    const alertCmpoFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear(); // ! clear anything that might have been rendered there before by simply calling viewContRef.clear()

    // * create a component
    const componentRef = hostViewContainerRef.createComponent(alertCmpoFactory); // ! pass the alert component factory

    //  ! get the componet method and variable to pass the input for @Input and event form @Output
    componentRef.instance.message = errorMessage;
    this.closeSub  =  componentRef.instance.close.subscribe(() => { // ! here we manually want to subscribe it
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }

  }

}
