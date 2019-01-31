export class TaskCreateJson {
    id: number;
    name: String;
    description: String;
    elapsedTime: number;
    lastStartTime: String;
    goal: String;
    watchType: number;
    isRunning: boolean;
    isTimerFinished: boolean;
    hour: number;
    minutes: number;
    seconds: number;
    currentSecond: number;
    isStoped: boolean;
    isCollapsed: boolean;
    maxValueHour: number;
    maxValueMinute: number;
    maxValueSecond: number;
    goals: number;
    ticksi: number;
}

