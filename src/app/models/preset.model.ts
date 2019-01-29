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
    isRunning: boolean;
    userId: number;
    watchtype: number;
}
