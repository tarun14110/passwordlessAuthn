/**
 * Add_User_To_DB Lambda code
 *
 * This is the code that is currently online in the Lambda function.
 */

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        const request = JSON.parse(event.body)
        await dynamo
            .put({
                TableName: "Data",
                Item: {
                    user_id: request.user_id,
                    site: request.site,
                }
            })
            .promise();
        body = `Put item ${JSON.stringify(request)}`;
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};
