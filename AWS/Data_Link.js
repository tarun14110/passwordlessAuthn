const BASE_URL = "https://6fjnmm13sl.execute-api.us-west-2.amazonaws.com";

class DB {
    
    static postUser = async (data = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT,OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }

        const response = await fetch(BASE_URL + "/user", {
            statusCode: 200,
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data),
        });

        const tempBody = await response.json();

        return {
            status: response.status,
            response: tempBody
        }
    }

    static removeUser = async (data = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT,OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }

        const response = await fetch(BASE_URL + "/user", {
            statusCode: 200,
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(data),
        });

        const tempBody = await response.json();

        return {
            status: response.status,
            response: tempBody
        }
    }

    static removalResponseLog(user_id, site) {
        console.log("Successfully removed " + user_id + " from " + site + ".");
    }

}
