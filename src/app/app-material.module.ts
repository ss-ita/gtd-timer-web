import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { MatGridListModule, MatInputModule, MatTabsModule, MatDialogModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
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
        MatOptionModule,
        MatSelectModule,
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
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
    ],

})
export class AppMaterialModule { }
