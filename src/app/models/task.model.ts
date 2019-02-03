import { DateTime } from './datetime.model';
import { Time } from './time.model';
import { TaskJson } from './taskjson.model';
import { DecimalPipe } from '@angular/common';


export class Task {
    id: number;
    name: string;
    description: string;
    elapsedTime: Time;
    lastStartTime: DateTime;
    goal: Time;
    isActive: boolean;
    isRunning: boolean;
    userId: number;
    watchType: number;

    constructor() {

    }
    convertFromTaskJson(task: TaskJson) {

        const milisecondsInHour = 3600000;
        const milisecondsInMinute = 60000;
        const milisecondsInSecond  = 1000;

        this.id = task.id;
        this.name = task.name;
        this.description = task.description;

        this.elapsedTime = null;
        if (task.elapsedTime != null) {
            const hours = Math.floor(Number(task.elapsedTime) / milisecondsInHour);
            const minutes = Math.floor((Number(task.elapsedTime) - hours * milisecondsInHour) / milisecondsInMinute);
            const seconds = Math.floor((Number(task.elapsedTime) - hours * milisecondsInHour - minutes * milisecondsInMinute)
            / milisecondsInSecond);
            this.elapsedTime = {
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                miliseconds: Number(task.elapsedTime) -
                (hours * milisecondsInHour + minutes * milisecondsInMinute + seconds * milisecondsInSecond)
            };
        }

        let times: any;
        let date: any;
        this.lastStartTime = null;
        if (task.lastStartTime != null) {
            date = task.lastStartTime.split('T')[0];
            times = task.lastStartTime.split('T')[1];
            const dateArray = date.split('-');
            const timeArray = times.split(':');
            this.lastStartTime = {
                year: Number(dateArray[0]),
                month: Number(dateArray[1]),
                day: Number(dateArray[2]),
                hours: Number(timeArray[0]),
                minutes: Number(timeArray[1]),
                seconds: Math.floor(Number(timeArray[2])),
                miliseconds: Number(this.getFraction(timeArray[2])) * milisecondsInSecond
            };
        }

        this.goal = null;
        if (task.goal != null) {
            times = task.goal.split(':');
            this.goal = {
                hours: Number(times[0]),
                minutes: Number(times[1]),
                seconds: Math.floor(Number(times[2])),
                miliseconds: Number(this.getFraction(times[2])) * milisecondsInSecond
            };
        }

        this.isActive = task.isActive;
        this.isRunning = task.isRunning;
        this.userId = task.userId;
        this.watchType = task.watchType;
    }

    convertToTaskJson(): TaskJson {

        const milisecondsInHour = 3600000;
        const milisecondsInMinute = 60000;
        const milisecondsInSecond = 1000;

        const dec = new DecimalPipe('en-au');
        let elTime = null;
        if (this.elapsedTime) {
            elTime = this.elapsedTime.hours * milisecondsInHour + this.elapsedTime.minutes * milisecondsInMinute
                + this.elapsedTime.seconds * milisecondsInSecond + this.elapsedTime.miliseconds;
        }


        let date = null;
        const year = dec.transform(this.lastStartTime.year, '4.0-0').toString();
        const yearToPass = year[0] + year[2] + year[3] + year[4];
        if (this.lastStartTime) {
            date = yearToPass.toString() + '-' + dec.transform(this.lastStartTime.month, '2.0-0').toString()
                + '-' + dec.transform(this.lastStartTime.day, '2.0-0').toString()
                + 'T' + dec.transform(this.lastStartTime.hours, '2.0-0').toString()
                + ':' + dec.transform(this.lastStartTime.minutes, '2.0-0').toString()
                + ':' + dec.transform((this.lastStartTime.seconds + this.lastStartTime.miliseconds / 1000), '2.0-3').toString() + 'Z';
        }

        let goalTime = null;
        if (this.goal) {
            goalTime = dec.transform(this.goal.hours, '2.0-0').toString() + ':' + dec.transform(this.goal.minutes, '2.0-0').toString()
                + ':' + dec.transform((this.goal.seconds + this.goal.miliseconds / 1000), '2.0-3').toString();
        }
        const taskJsonToReturn: TaskJson = {
            id: this.id,
            name: this.name,
            description: this.description,
            elapsedTime: elTime,
            lastStartTime: date,
            goal: goalTime,
            isActive: this.isActive,
            isRunning: this.isRunning,
            userId: this.userId,
            watchType: this.watchType
        };
        return taskJsonToReturn;
    }

    getFraction(n: String) {
        const doesExist = n.indexOf('.');
        let valStr = String(0);
        if (doesExist !== -1) {
            valStr = n.slice(n.indexOf('.'));
        }
        return valStr;
    }
}
