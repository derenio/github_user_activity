import { loggers } from 'winston';


export function Logger(category) {
  const options = {
    console: {
      colorize: true,
      label: category,
      level: 'debug',
      prettyPrint: true,
      timestamp: true,
    },
  };
  return loggers.add(category, options);
}


export default Logger;
