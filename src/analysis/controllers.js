import path from 'path';

import { Logger } from '../libs/logger';
import {
  getDataFilenames, loadData, formatData,
  groupByDate, groupByDateAndUser, groupByDateAndType } from '../libs/data';

const log = Logger('analysis/controllers'); // eslint-disable-line no-unused-vars


export async function activitiesList(req, res) {
  const dataFilenames = getDataFilenames();
  const context = {
    dataFilenames,
  };
  res.render(path.join(__dirname, '/views/activities'), context);
}

export async function activityDetail(req, res) {
  const { filename } = req.params;
  const data = loadData(filename);
  const formattedData = formatData(data);
  const grouppedByDate = groupByDate(formattedData);
  const grouppedByDateAndUser = groupByDateAndUser(formattedData);
  const grouppedByDateAndType = groupByDateAndType(formattedData);
  const context = {
    dataFilename: filename,
    // Escape all the slashes in the closing tags of the json string
    data: JSON.stringify(data, null, 2).replace(new RegExp('</', 'g'), '<\\/'),
    formattedData: JSON.stringify(formattedData, null, 2),
    grouppedByDate: JSON.stringify(grouppedByDate, null, 2),
    grouppedByDateAndUser: JSON.stringify(grouppedByDateAndUser, null, 2),
    grouppedByDateAndType: JSON.stringify(grouppedByDateAndType, null, 2),
  };
  res.render(path.join(__dirname, '/views/activityDetail'), context);
}
