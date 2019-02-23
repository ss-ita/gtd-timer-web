import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { Observable } from 'rxjs';
import { ToasterService } from './toaster.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RoleModelJson } from '../models/role-json.model';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class RoleService {

    isAdmin = false;
    isSuperAdmin = false;
    isDisplayUsers = true;
    isDisplayAdmins = false;
    emailOfUsers: string[] = [];
    emailOfAdmins: string[] = [];

    constructor(private http: HttpClient,
        private service: ConfigService,
        private toasterService: ToasterService,
        private dialog: MatDialog) { }

    getEmails(roleName: string) {
        this.http.get<string[]>(this.service.urlAdmin + 'GetUsersEmails/' + roleName).subscribe(data => {

            if (roleName === 'User') {
                for (let i = 0; i < data.length; ++i) {
                    this.emailOfUsers.push('');
                    this.emailOfUsers[i] = data[i];
                }
            }

            if (roleName === 'Admin') {
                for (let i = 0; i < data.length; ++i) {
                    this.emailOfAdmins.push('');
                    this.emailOfAdmins[i] = data[i];
                }
            }
        });
    }

    AddRole(email: string, role: string) {
        const roleModel = new RoleModelJson();
        roleModel.email = email;
        roleModel.role = role;
        this.http.post<RoleModelJson>(this.service.urlAdmin + 'AddRole', roleModel).pipe(first()).subscribe(
            _ => {
                this.toasterService.showToaster('Role added');
                const indexUserToDelete = this.emailOfUsers.indexOf(email, 0);
                this.emailOfUsers.splice(indexUserToDelete, 1);
                this.emailOfAdmins.push(email);
            },
            response => {
                this.toasterService.showToaster(response.error.Message);
            });
    }

    DeleteUser(email: string) {
        this.http.delete(this.service.urlAdmin + 'DeleteUserByEmail/' + email).pipe(first()).subscribe(
            _ => {
                this.toasterService.showToaster('User is deleted');
                const indexUserToDelete = this.emailOfUsers.indexOf(email, 0);
                this.emailOfUsers.splice(indexUserToDelete, 1);
            },
            response => {
                this.toasterService.showToaster(response.error.Message);
            });
    }

    DeletRole(email: string, role: string) {
        const roleModel = new RoleModelJson();
        roleModel.email = email;
        roleModel.role = role;
        this.http.delete(this.service.urlAdmin + 'RemoveRole/' + email + '/' + role).pipe(first()).subscribe(
            _ => {
                this.toasterService.showToaster('Role is deleted');
                const indexUserToDelete = this.emailOfAdmins.indexOf(email, 0);
                this.emailOfAdmins.splice(indexUserToDelete, 1);
                this.emailOfUsers.push(email);
            },
            response => {
                this.toasterService.showToaster(response.error.Message);
            });
    }

    openConfirmationDialogRole(email: string, role: string) {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            hasBackdrop: true,
            closeOnNavigation: true,
            disableClose: false
        });
        confirmationDialogRef.componentInstance.title = 'Warning';
        confirmationDialogRef.componentInstance.message = 'Are you sure to permanently delete this role from user?';
        confirmationDialogRef.componentInstance.btnCancelText = 'Cancel';
        confirmationDialogRef.componentInstance.btnOkText = 'Confirm';
        confirmationDialogRef.componentInstance.acceptAction = () => {
            this.DeletRole(email, role);
        };
    }

    openConfirmationDialogUser(email: string) {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            hasBackdrop: true,
            closeOnNavigation: true,
            disableClose: false
        });
        confirmationDialogRef.componentInstance.title = 'Warning';
        confirmationDialogRef.componentInstance.message = 'Are you sure to permanently delete this user?';
        confirmationDialogRef.componentInstance.btnCancelText = 'Cancel';
        confirmationDialogRef.componentInstance.btnOkText = 'Confirm';
        confirmationDialogRef.componentInstance.acceptAction = () => {
            this.DeleteUser(email);
        };
    }

    getRolesFromServer(): Observable<string[]> {
        return this.http.get<string[]>(this.service.urlAdmin + 'GetRolesOfUser');
    }

    getRoles() {
        this.getRolesFromServer().subscribe(data => {
            this.isAdmin = false;
            this.isSuperAdmin = false;

            for (let i = 0; i < data.length; ++i) {

                if (data[i] == 'Admin') {
                    this.isAdmin = true;
                }
            }
        });
    }

    displayUsers() {
        this.isDisplayUsers = true;
        this.isDisplayAdmins = false;
    }

    displayAdmins() {
        this.isDisplayUsers = false;
        this.isDisplayAdmins = true;
    }
}
