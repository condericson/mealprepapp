exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ?
                           'mongodb://condericson:12345@ds041536.mlab.com:41536/heroku_13dqhzp9' :
                           'mongodb://localhost/meal-prep-app');
exports.PORT = process.env.PORT || 8080;
