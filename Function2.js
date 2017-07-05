const updateClient = function(client, id, connection) {

	return new Promise((resolve, reject) => {

		const query = 'UPDATE Clients SET ? WHERE id = ?';
		connection.query(query, [client, id], (error, results, fields) => { // Sintax error. Added query parameter as it was missing

			if (!error) {

				resolve(results);

			} else {
				reject(error); // Added reject error call
			}

		});

	});

};

module.exports = {

	update: (event, context, callback) => { // Sintax error. changed = for : due to exports is defined as an object

		if (!event.pathParameters.id) {

			callback(null, {

				statusCode: 400

			});

		} else {

			const body = JSON.parse(event.body); // Might throw a Runtime error: this.body might be not found. Changed to a constant

			const connection = db.connect(event.stageVariables); // Might throw a Runtime error: this.connection might be not found. Changed to a constant

			updateClient(body, event.pathParameters.id, connection) // Updated parameters
			.then((results) => {

				db.close(this.connection);

				callback(null, {

					// statusCode: 201, // The origin server MUST create the resource before returning the 201 status 
					statusCode: 200, // OK
					headers: { "Access-Control-Allow-Origin": "*" }, // Okay as it can be trigerred from different sources
					body: JSON.stringify(results)

				});

			})
			.catch((error) => {

				console.log('error ', error);
				db.close(this.connection);

				callback(null, {

					statusCode: 500, // Might be okay. A better code should be 400 Bad Request
					headers: { "Access-Control-Allow-Origin": "*" }, // Okay as it can be trigerred from different sources
					body: JSON.stringify(error)

				});

			});

		}

	} // Sintax error. deleted ;
}