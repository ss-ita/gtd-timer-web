import { DateTime } from './datetime.model';
import { Time } from './time.model';

export class PresetModel {
    id: number;
    presetName: string;
    tasks: Task[];
}

export class Task {
    id: number;
    taskName: String;
    hours: number;
    minutes: number;
    seconds: number;
}

export class PresetModelJson {
    id: number;
    presetName: string;
    tasks: TaskJson[];
}

export class TaskJson {
    id: number;
    name: String;
    description: String;
    elapsedTime: number;
    lastStartTime: String;
    goal: String;
    isActive: boolean;
    isRunning: boolean;
    userId: number;
    watchtype: number;
}

export class PresetModelToUpdate {
    id: number;
    presetName: string;
    tasks: TaskJson[];
}

export class TimerUpdate {
    id: number;
    name: String;
    interval: string;
    presetId: number;
}

export class Timer {
    id: number;
    timerName: string;
    hours: number;
    minutes: number;
    seconds: number;
}
