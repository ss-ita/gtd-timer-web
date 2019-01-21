export class PresetModel {
    id: number;
    presetName: string;
    timers: Timer[];
}
export class Timer {
    id: number;
    timerName: string;
    hours: number;
    minutes: number;
    seconds: number;
}
export class PresetModelJson {
    id: number;
    presetName: string;
    timers: TimerJson[];
}
export class TimerJson {
    id: number;
    name: string;
    interval: string;
}
export class PresetModelToUpdate {
    id: number;
    presetName: string;
    timers: TimerUpdate[];
}
export class TimerUpdate {
    id: number;
    name: string;
    interval: string;
    presetId: number;
}
