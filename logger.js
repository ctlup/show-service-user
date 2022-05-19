const winston = require('winston');

export default logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'errors.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      }));
}