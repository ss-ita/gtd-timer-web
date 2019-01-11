import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StyleService {
    isLineStyle: boolean = false;
    changeStyleString: string = "Change style to line"

    changeStyle() {

        if(this.isLineStyle === false){
            this.isLineStyle = true;
            this.changeStyleString = "Change style to circle";
        }

        else{
            this.isLineStyle = false;
            this.changeStyleString = "Change style to line";
        }
    }

    constructor() { }
}