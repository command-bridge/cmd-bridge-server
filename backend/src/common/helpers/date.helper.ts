export type CronControl = {
    getElaspedTimeMs: () => string;
};

export function dateIsOlderThanHours(date: Date, hours: number) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - hours * 60 * 60 * 1000);

    return date < twentyFourHoursAgo;
}

export function dateIsOlderThanMinutes(date: Date, minutes: number) {
    const now = new Date();
    const minutesAgo = new Date(now.getTime() - minutes * 60 * 1000);

    return date < minutesAgo;
}

function dateStopCron(begin: [number, number]) {
    const elapsedTime = process.hrtime(begin);
    const elapsedMilliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;

    return `${elapsedMilliseconds}ms`;
}

export function dateStartCron(): CronControl {
    const begin = process.hrtime();

    return {
        getElaspedTimeMs: () => dateStopCron(begin),
    };
}
