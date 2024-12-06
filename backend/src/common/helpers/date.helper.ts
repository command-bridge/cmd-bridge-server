export function dateIsOlderThanHours(date: Date, hours: number) {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - hours * 60 * 60 * 1000);

    return date < twentyFourHoursAgo;
}

function dateStopCron(begin: [number, number]) {
    const elapsedTime = process.hrtime(begin);
    const elapsedMilliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;

    return `${elapsedMilliseconds}ms`;
}

export function dateStartCron() {
    const begin = process.hrtime();

    return {
        getElaspedTimeMs: () => dateStopCron(begin),
    };
}
