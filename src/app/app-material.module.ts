import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatCheckboxModule, MatGridListModule,MatInputModule, MatTabsModule} from '@angular/material';

@NgModule({
imports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule, 
    MatGridListModule,
    MatInputModule,
    MatTabsModule
],
exports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule, 
    MatGridListModule,
    MatInputModule,
    MatTabsModule
],

})
export class AppMaterialModule { }
