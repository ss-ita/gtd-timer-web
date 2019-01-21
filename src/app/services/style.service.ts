import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StyleService {
    isLineStyle = false;
    changeStyleString = 'Switch to standart';

    changeStyle() {
        if (this.isLineStyle === false) {
            this.isLineStyle = true;
            this.changeStyleString = 'Switch to round progress';
        } else {
            this.isLineStyle = false;
            this.changeStyleString = 'Switch to standart';
        }
    }

    constructor() { }
}
