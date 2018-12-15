import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatCheckboxModule, MatGridListModule,MatInputModule, MatTabsModule, MatDialogModule} from '@angular/material';

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
    MatTabsModule,
    MatDialogModule
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
    MatTabsModule,
    MatDialogModule
],

})
export class AppMaterialModule { }
