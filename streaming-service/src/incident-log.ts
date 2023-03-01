import fs from 'fs'

interface msg {
    "battery-temp": number;
    "timestamp": number;
}

let timeRecord: msg[] = [];
let incidentCount = 0;

export function tempCheck(msg: msg) {
    let firstTime = 0;
    // recording all exceeded temperatures and updating oldest incident to compare
    if (msg['battery-temp'] < 20 || msg['battery-temp'] > 80) {
        timeRecord.push(msg);
    
        if (timeRecord.length === 1) {
            firstTime = timeRecord[0].timestamp;
        } 
    }

    if (timeRecord.length > 3) {
        const timeNow = Date.now();
        if (msg.timestamp - firstTime < 5000) {
            logIncident(timeNow);
            timeRecord = [];
        } else {
            timeRecord.shift();
            firstTime = timeRecord[0].timestamp;
        }
    }
}

export function logIncident(time: number) {
    const logMsg = `Exceeded Safe Operating Temperature at ${new Date(time).toDateString()}\n}`
    fs.appendFile('./logs/incidents.log', logMsg, (error) => {
        if (error) {
            console.error(`Could not write to incidents log: ${error}`)
        }
    });
}