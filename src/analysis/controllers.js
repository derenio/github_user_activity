import path from 'path';

import { Logger } from '../libs/logger';
import {
  getDataFilenames, loadData, formatData, groupByDate, groupByDateAndUser,
  groupByDateAndType, groupByDayOfWeek, groupByHourOfDay, getWorkedOn,
} from '../libs/data';

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
  const grouppedByDayOfWeek = groupByDayOfWeek(formattedData);
  const grouppedByHourOfDay = groupByHourOfDay(formattedData);
  const context = {
    dataFilename: filename,
    // Escape all the slashes in the closing tags of the json string
    data: JSON.stringify(data, null, 2).replace(new RegExp('</', 'g'), '<\\/'),
    formattedData: JSON.stringify(formattedData, null, 2),
    grouppedByDate: JSON.stringify(grouppedByDate, null, 2),
    grouppedByDateAndUser: JSON.stringify(grouppedByDateAndUser, null, 2),
    grouppedByDateAndType: JSON.stringify(grouppedByDateAndType, null, 2),
    grouppedByDayOfWeek: JSON.stringify(grouppedByDayOfWeek, null, 2),
    grouppedByHourOfDay: JSON.stringify(grouppedByHourOfDay, null, 2),
  };
  res.render(path.join(__dirname, '/views/activity_detail'), context);
}


export async function workedOn(req, res) {
  const { filename } = req.params;
  const { login } = req.query;
  const data = loadData(filename);
  let formattedData = formatData(data);
  if (login) {
    formattedData = formattedData.filter(d => d.author === login);
  }
  const workedOnData = getWorkedOn(formattedData);
  const context = {
    workedOnData: JSON.stringify(workedOnData, null, 2),
  };
  res.render(path.join(__dirname, '/views/worked_on'), context);
}
