import fs from 'fs';
import path from 'path';

import { DATA_PATH } from '../config';
import { Logger } from './logger';

const log = Logger('libs/data'); // eslint-disable-line no-unused-vars


export function writeData(filename, jsonData) {
  const filepath = path.join(DATA_PATH, filename);
  const jsonStr = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync(filepath, jsonStr, 'utf8');
}


export function loadLatestData() {
  const paths = fs.readdirSync(DATA_PATH).sort();
  const lastPath = path.join(DATA_PATH, paths[paths.length - 1]);
  const jsonStr = fs.readFileSync(lastPath, 'utf8');
  return JSON.parse(jsonStr);
}


export function formatData(data) {
  const results = [];
  // Extract essential fields
  Object.entries(data).forEach(([key, values]) => {
    values.forEach((elem) => {
      const result = {
        type: key,
        org: elem.org,
        repo: elem.repo,
        author: elem.author,
        createdAt: elem.createdAt,
        dayOfWeek: elem.dayOfWeek,
        hourOfDay: elem.hourOfDay,
      };
      results.push(result);
    });
  });
  return results;
}
