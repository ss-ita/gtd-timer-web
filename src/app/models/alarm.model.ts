export class AlarmModel {
    id: number;
    date: Date;
    repeat: string;
    soundOn: boolean;
    isOn: boolean;
    isPlay: boolean;
    message: string;
    timeoutIndex: any;
    cronExpression: string;
}
