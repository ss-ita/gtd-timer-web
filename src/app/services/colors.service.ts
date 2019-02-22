import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  public colors = [];

  constructor() { }

  public hsvToRgb(h: any, s: any, v: any) {
    let r: any, g: any, b: any;
    let i: any;
    let f: any, p: any, q: any, t: any;

    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    s /= 100;
    v /= 100;

    if (s == 0) {
      r = g = b = v;

      return 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ', 0.5)';
    }

    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      default:
        r = v;
        g = p;
        b = q;
    }
    return 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ', 0.5)';
  }

  public randomColors(total: number) {
    let i = 360 / (total - 1);

    for (var x = 0; x < total; x++) {
      this.colors.push(this.hsvToRgb(i * x, 100, 100));
    }

    return this.colors;
  }
}
