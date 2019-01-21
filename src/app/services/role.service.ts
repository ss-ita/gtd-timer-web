import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    nameOfTab = 'Contact us...';
    emails: string[] = [];

    constructor(private http: HttpClient,
        private service: ConfigService,
        private toasterService: ToasterService,
        private dialog: MatDialog) { }

    getEmailsFromServer(): Observable<string[]> {
        const headers = this.getHeaders();
        return this.http.get<string[]>(this.service.urlAdmin + 'GetUsersEmails', { headers: headers });
    }

    private getHeaders() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        });

        return headers;
    }

    getEmails() {
        this.getEmailsFromServer().subscribe(data => {
            for (let i = 0; i < data.length; ++i) {
                this.emails.push('');
                this.emails[i] = data[i];
            }
        });
    }

    AddRole(email: string, role: string) {
        const headers = this.getHeaders();
        const roleModel = new RoleModelJson();
        roleModel.email = email;
        roleModel.role = role;
        this.http.post<RoleModelJson>(this.service.urlAdmin + 'AddRole', roleModel, { headers: headers }).pipe(first()).subscribe(
            _ => {
                this.toasterService.showToaster('Role added');
            },
            response => {
                this.toasterService.showToaster(response.error.Message);
            });
    }

    DeletUser(email: string) {
        const headers = this.getHeaders();
        this.http.delete(this.service.urlAdmin + 'DeleteUserByEmail/' + email, { headers: headers }).pipe(first()).subscribe(
            _ => {
                this.toasterService.showToaster('User is deleted');
                const indexUserToDelete = this.emails.indexOf(email, 0);
                this.emails.splice(indexUserToDelete, 1);
            },
            response => {
                this.toasterService.showToaster(response.error.Message);
            });
    }

    DeletRole(email: string, role: string) {
        const headers = this.getHeaders();
        const roleModel = new RoleModelJson();
        roleModel.email = email;
        roleModel.role = role;
        this.http.delete(this.service.urlAdmin + 'RemoveRole/' + email + '/' + role, { headers: headers }).pipe(first()).subscribe(
            _ => {
                this.toasterService.showToaster('Role is deleted');
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
            this.DeletUser(email);
        };
    }

    getRolesFromServer(): Observable<string[]> {
        const headers = this.getHeaders();
        return this.http.get<string[]>(this.service.urlAdmin + 'GetRolesOfUser', { headers: headers });
    }

    getRoles() {
        this.getRolesFromServer().subscribe(data => {
            for (let i = 0; i < data.length; ++i) {

                if (data[i] == 'Admin') {
                    this.isAdmin = true;
                    this.nameOfTab = 'Admin page...';
                }else{
                    this.isAdmin = false;
                }

                if (data[i] == 'SuperAdmin') {
                    this.isSuperAdmin = true;
                }else{
                    this.isSuperAdmin = false;
                }
            }
        });
    }
}
