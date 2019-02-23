import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StyleService {
    isLineStyle = false;
    changeStyleString = 'Mechanical view';

    changeStyle() {
        if (this.isLineStyle === false) {
            this.isLineStyle = true;
            this.changeStyleString = 'Rounded view';
        } else {
            this.isLineStyle = false;
            this.changeStyleString = 'Mechanical view';
        }
    }

    constructor() { }
}
