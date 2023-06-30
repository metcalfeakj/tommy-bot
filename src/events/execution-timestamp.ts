import * as fs from 'fs';

class ExecutionTimestamp {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    initializeExecutionTimestamp(): Date {
        if (fs.existsSync(this.filePath)) {
            const stats = fs.statSync(this.filePath);
            const lastModifiedDateTime = new Date(stats.mtime);
            this.updateFileWithCurrentDateTime();
            console.log(`Last modified datetime: ${lastModifiedDateTime}`);
            return lastModifiedDateTime;
        } else {
            const currentDateTime = this.createFileWithCurrentDateTime();
            return currentDateTime;
        }
    }

    private getCurrentDateTime(): Date {
        return new Date();
    }

    private createFileWithCurrentDateTime(): Date {
        const currentDateTime = this.getCurrentDateTime();
        fs.writeFileSync(this.filePath, '');
        fs.utimesSync(this.filePath, currentDateTime, currentDateTime);
        console.log(`Created file with datetime: ${currentDateTime}`);
        return currentDateTime;
    }

    private updateFileWithCurrentDateTime(): Date {
        const currentDateTime = this.getCurrentDateTime();
        fs.utimesSync(this.filePath, currentDateTime, currentDateTime);
        console.log(`Updated file with datetime: ${currentDateTime}`);
        return currentDateTime;
    }
}

export default ExecutionTimestamp;
