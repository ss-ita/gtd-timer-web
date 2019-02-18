export class AlarmCronModel {
    id: number;
    cronExpression: string;
    isOn: boolean;
    soundOn: boolean;
    timestamp: string;
    isUpdated: boolean;
    message: string;
}
