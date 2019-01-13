import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StyleService {
    isLineStyle = false;
    changeStyleString = 'Change style';

    changeStyle() {
        if (this.isLineStyle === false) {
            this.isLineStyle = true;
        } else {
            this.isLineStyle = false;
        }
    }

    constructor() { }
}
