import * as fs from 'fs';

const filePath = './.lastRunTime';

export function getCurrentDateTime(): Date {
  return new Date();
}

export function createFileWithCurrentDateTime(): Date {
  const currentDateTime = getCurrentDateTime();
  fs.writeFileSync(filePath, '');
  fs.utimesSync(filePath, currentDateTime, currentDateTime);
  console.log(`Created .lastRunTime file with datetime: ${currentDateTime}`);
  return currentDateTime;
}

export function updateFileWithCurrentDateTime(): Date {
  const currentDateTime = getCurrentDateTime();
  fs.utimesSync(filePath, currentDateTime, currentDateTime);
  console.log(`Updated .lastRunTime file with datetime: ${currentDateTime}`);
  return currentDateTime;
}

export function checkLastRunTimeFile(): Date {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const lastModifiedDateTime = new Date(stats.mtime);
    const currentDateTime = updateFileWithCurrentDateTime();
    console.log(`Last modified datetime: ${lastModifiedDateTime}`);
    return lastModifiedDateTime;
  } else {
    const currentDateTime = createFileWithCurrentDateTime();
    return currentDateTime;
  }
}
