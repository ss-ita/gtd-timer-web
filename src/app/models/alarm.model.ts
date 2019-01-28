export class AlarmModel {
    id: number;
    date: Date;
    repeat: string;
    isSound: boolean;
    isTurnOn: boolean;
    isPlay: boolean;
    message: string;
    timeoutIndex: any;
    cronExpression: string;
}
