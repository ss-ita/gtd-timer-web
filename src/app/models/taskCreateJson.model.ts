export class TaskCreateJson {
    id: number;
    name: string;
    description: string;
    elapsedTime: number;
    lastStartTime: string;
    goal: string;
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

