import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StyleService {
    isLineStyle: boolean = false;
    changeStyleString: string = "Change style"

    changeStyle() {

        if(this.isLineStyle === false){
            this.isLineStyle = true;
        }

        else{
            this.isLineStyle = false;
        }
    }

    constructor() { }
}