import { DateTime } from './datetime.model';
import { Time } from './time.model';
import { TaskJson } from './taskjson.model';
import { DecimalPipe } from '@angular/common';


export class Task {
    id: number;
    name: String;
    description: String;
    elapsedTime: Time;
    lastStartTime: DateTime;
    goal: Time;
    isActive: boolean;
    isRunning: boolean;
    userId: number;

    constructor(){

    }
    convertFromTaskJson(task: TaskJson) {
        this.id = task.id;
        this.name = task.name;
        this.description = task.description;

        this.elapsedTime = null;
        if (task.elapsedTime) {
            let hours = Math.floor(Number(task.elapsedTime) / 3600000);
            let minutes = Math.floor((Number(task.elapsedTime) - hours * 3600000) / 60000);
            let seconds = Math.floor((Number(task.elapsedTime) - hours * 3600000 - minutes * 60000) / 1000)
            this.elapsedTime = {
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                miliseconds: Number(task.elapsedTime) - (hours * 3600000 + minutes * 60000 + seconds * 1000)
            }
        }

        let times: any;
        let date: any;
        this.lastStartTime = null;
        if (task.lastStartTime) {
            date = task.lastStartTime.split('T')[0];
            times = task.lastStartTime.split('T')[1];
            let dateArray = date.split('-');
            let timeArray = times.split(':');
            this.lastStartTime = {
                year: Number(dateArray[0]),
                month: Number(dateArray[1]),
                day: Number(dateArray[2]),
                hours: Number(timeArray[0]),
                minutes: Number(timeArray[1]),
                seconds: Math.floor(Number(timeArray[2])),
                miliseconds: Number(this.getFraction(timeArray[2])) * 1000
            }
        }
        
        this.goal = null;
        if (task.goal) {
            times = task.goal.split(':');
            this.goal = {
                hours: Number(times[0]),
                minutes: Number(times[1]),
                seconds: Math.floor(Number(times[2])),
                miliseconds: Number(this.getFraction(times[2])) * 1000
            }
        }
         
        this.isActive = task.isActive;
        this.isRunning = task.isRunning;
        this.userId = task.userId;
    }

    convertToTaskJson(): TaskJson {
        let dec = new DecimalPipe('en-au');
        let elTime = null;
        if(this.elapsedTime){
           elTime=  this.elapsedTime.hours * 3600000 + this.elapsedTime.minutes * 60000 + this.elapsedTime.seconds * 1000 + this.elapsedTime.miliseconds;
        }
        
        let date = null
        if(this.lastStartTime){
            date = this.lastStartTime.year.toString() + '-' + this.lastStartTime.month.toString() + '-' + this.lastStartTime.day.toString()
            + 'T' + dec.transform(this.lastStartTime.hours,'2.0-0').toString()
             + ':' + dec.transform(this.lastStartTime.minutes,'2.0-0').toString()
              + ':' + dec.transform((this.lastStartTime.seconds + this.lastStartTime.miliseconds / 1000),'2.0-3').toString() + 'Z';
        }
        
        let goalTime = null;
        if (this.goal) {
            goalTime = dec.transform(this.goal.hours,'2.0-0').toString() + ':' + dec.transform(this.goal.minutes,'2.0-0').toString() + ':' + dec.transform((this.goal.seconds + this.goal.miliseconds / 1000),'2.0-3').toString();
        }
        let taskJsonToReturn: TaskJson = {
            id: this.id,
            name: this.name,
            description: this.description,
            elapsedTime: elTime,
            lastStartTime: date,
            goal: goalTime,
            isActive: this.isActive,
            isRunning: this.isRunning,
            userId: this.userId
        }
        return taskJsonToReturn;
    }

    getFraction(n: String) {
        let doesExist = n.indexOf('.');
        let valStr = String(0);
        if (doesExist != -1) {
            valStr = n.slice(n.indexOf('.'));
        }
        return valStr;
    }

}