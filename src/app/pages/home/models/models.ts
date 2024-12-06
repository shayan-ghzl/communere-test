export interface Reminder {
    id: number;
    title: string;
    dosage: string;
    unit: string;
    days: string[];
    time: Date[];
    lastUpdated: Date;
}