declare var exports;
declare var db;

exports.getAll = function(event, context, callback) {

	const connection = db.connect(event.stageVariables);

	var query = 'SELECT * FROM Clients ORDER BY ' + connection.escape(event.queryStringParameters.sort); // escaping query values to avoid sql injection

	connection.query(query, (error, results, fields) => { // escaping sql parameters to avoid sql injection

		if (error) {

			db.close(connection);

			callback(null, {
				// statusCode: 205, // 2xx codes are reserved for Sucess events. 205 means Reset content (eg. clearing the form)
				statusCode: 400, // Bad Request error
				headers: { "Access-Control-Allow-Origin": "*" }, // if we want to restrict requests from cross-origin, * should be changed to the app domain
				body: JSON.stringify(error)
			});

		} else {

			db.close(connection);

			callback(null, {
				statusCode: 200,
				headers: { "Access-Control-Allow-Origin": "*" }, // for this example, we must change * with the app domain, as it seems to be a restricted call: forbidden request from external domains
				body: JSON.stringify(results)
			});

		}
	});
};