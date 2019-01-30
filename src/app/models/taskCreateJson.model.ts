export class TaskCreateJson {
    id: number;
    name: String;
    description: String;
    elapsedTime: number;
    lastStartTime: String;
    lastStartTimeNumber: number;
    goal: String;
    watchType: number;
    isActive: boolean;
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
}
