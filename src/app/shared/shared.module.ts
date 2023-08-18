import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinner } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";
import { LoggingService } from "../logging.service";

@NgModule({
  declarations:[
    LoadingSpinner,
    AlertComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports:[CommonModule, FormsModule,FormsModule],
  exports:[
    LoadingSpinner,
    AlertComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
    FormsModule
  ],
    entryComponents:[AlertComponent], //  ! below angular 9 we need entry componts above to it we can omit it
  providers: [LoggingService]
})
export class SharedModule{

}
