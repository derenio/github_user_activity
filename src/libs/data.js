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


export function getDataFilenames() {
  const paths = fs.readdirSync(DATA_PATH).sort();
  return paths;
}


export function loadData(filename) {
  const filepath = path.join(DATA_PATH, filename);
  const jsonStr = fs.readFileSync(filepath, 'utf8');
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
        updatedAt: elem.updatedAt,
        dayOfWeek: elem.dayOfWeek,
        hourOfDay: elem.hourOfDay,
      };
      results.push(result);
    });
  });
  return results;
}


function groupBy(arr, keyFn) {
  return arr.reduce((acc, elem) => {
    const groupName = keyFn(elem);
    (acc[groupName] = acc[groupName] || []).push(elem);
    return acc;
  }, {});
}


export function groupByDate(formattedData) {
  const dateAndTypeGroups = groupBy(
    formattedData,
    elem => `${elem.createdAt.split('T')[0]}`,
  );
  const groups = [];
  Object.entries(dateAndTypeGroups).forEach(([key, items]) => {
    const [date] = key.split('|');
    groups.push({ date, items });
  });
  return groups;
}


export function groupByDateAndUser(formattedData) {
  const dateAndAuthorGroups = groupBy(
    formattedData,
    elem => `${elem.createdAt.split('T')[0]}|${elem.author}`,
  );
  const groups = [];
  Object.entries(dateAndAuthorGroups).forEach(([key, items]) => {
    const [date, author] = key.split('|');
    const grouppedTypes = groupBy(items, elem => elem.type);
    groups.push({
      date,
      author,
      ...grouppedTypes,
    });
  });
  return groups;
}


export function groupByDateAndType(formattedData) {
  const dateAndTypeGroups = groupBy(
    formattedData,
    elem => `${elem.createdAt.split('T')[0]}|${elem.type}`,
  );
  const groups = [];
  Object.entries(dateAndTypeGroups).forEach(([key, items]) => {
    const [date, type] = key.split('|');
    groups.push({ date, type, items });
  });
  return groups;
}


export function groupByDayOfWeek(formattedData) {
  const dayGroups = groupBy(
    formattedData,
    elem => elem.dayOfWeek,
  );
  const groups = [];
  Object.entries(dayGroups).forEach(([dayOfWeek, items]) => {
    const count = items.length;
    groups.push({ dayOfWeek: parseInt(dayOfWeek, 10), items, count });
  });
  return groups;
}


export function groupByHourOfDay(formattedData) {
  const hourGroups = groupBy(
    formattedData,
    elem => elem.hourOfDay,
  );
  const groups = [];
  Object.entries(hourGroups).forEach(([hourOfDay, items]) => {
    const count = items.length;
    groups.push({ hourOfDay: parseInt(hourOfDay, 10), items, count });
  });
  return groups;
}
