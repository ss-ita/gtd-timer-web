import { Time } from '@angular/common';

export class TaskJson{
   id:number;
   name: String;
   description: String;
   elapsedTime: number;
   lastStartTime: String;
   goal:String;
   isActive:boolean;
   isRunning:boolean;
   userId:number;
}