exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/meal-prep-app';
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-meal-prep-app');
exports.PORT = process.env.PORT || 8080;

//
// exports.DATABASE_URL = process.env.DATABASE_URL ||
//                        global.DATABASE_URL ||
//                        (process.env.NODE_ENV === 'production' ?
//                             'mongodb://<dbUsername>:<dbPassword>@ds049538.mlab.com:49538/simply_todos' :
//                             'mongodb://localhost/simply-to-dos');
// exports.PORT = process.env.PORT || 8080;
