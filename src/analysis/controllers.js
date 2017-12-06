import path from 'path';

import { Logger } from '../libs/logger';
import { loadLatestData, formatData } from '../libs/data';

const log = Logger('analysis/controllers'); // eslint-disable-line no-unused-vars


export async function activities(req, res) {
  let data;
  try {
    data = loadLatestData();
  } catch (e) {
    log.error(e);
    res.status(500).json(e);
    return;
  }
  const formattedData = formatData(data);
  const context = {
    // Escape all the slashes in the closing tags of the json string
    data: JSON.stringify(data, null, 2).replace(new RegExp('</', 'g'), '<\\/'),
    formattedData: JSON.stringify(formattedData, null, 2),
  };
  res.render(path.join(__dirname, '/views/activities'), context);
}

export default activities;
