export class PresetModel {
    presetName: string;
    timers: Timer[];
}
export class Timer {
    timerName: string;
    hours: number;
    minutes: number;
    seconds: number;
}
export class PresetModelJson {
    presetName: string;
    timers: TimerJson[];
}
export class TimerJson {
    name: string;
    interval: string;
}
