export class TaskCreateJson {
    id: number;
    name: String;
    description: String;
    elapsedTime: number;
    lastStartTime: String;
    lastStartTimeNumber: number;
    goal: String;
    isActive: boolean;
    isRunning: boolean;
    hour: number;
    minutes: number;
    seconds: number;
    currentSecond: number;
    isStoped: boolean;
}
