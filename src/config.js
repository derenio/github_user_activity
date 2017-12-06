import path from 'path';


export const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
export const SINCE = '2017-06-01T00:00:00Z';
export const { GITHUB_TOKEN } = process.env;
export const DATA_PATH = path.join(__dirname, '/../data/');
