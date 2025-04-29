import ballerina/http;
import ballerina/crypto;
import ballerina/io;

listener http:Listener proxyListener = new (3000);

service / on proxyListener {

    resource function get .() returns json {
        return {
            "message":"Pre-password update service up and running!",
            "status":"OK"
        };
    }

    resource function post passwordcheck(http:Caller caller, http:Request req) returns error? {
        json|error payloadResult = req.getJsonPayload();
        if payloadResult is error {
            return respondError(caller, 400, "invalid_request", "Invalid JSON payload.");
        }

        json payload = payloadResult;

        // Safely extract nested fields
        string? password = (check payload?.event?.user?.updatingCredential?.value).toString();
        string? format = (check payload?.event?.user?.updatingCredential?.format).toString();

        if password is () || format is () || password.trim() == "" || format.trim() == "" {
            return respondError(caller, 400, "invalid_credential", "Missing or empty password or format.");
        }

        // Here we are expecting the password in plain text
        // TODO: Add support for other formats
        byte[] input = password.toBytes();
        string sha1 = crypto:hashSha1(input).toBase16().toUpperAscii();

        string prefix = sha1.substring(0, 5);
        string suffix = sha1.substring(5);

        http:Client hibpClient = check new ("https://api.pwnedpasswords.com");

        http:Response|http:ClientError hibpResp = hibpClient->get(
            path = "/range/" + prefix);

        if hibpResp is http:ClientError {
            string errMsg = "An error has occurred. " + hibpResp.message();
            check respondError(caller, 500, "external_error", errMsg);
            return;
        }

        string hibpRespBody = check hibpResp.getTextPayload();
        string:RegExp newlineRegex = re `\n`;
        string:RegExp colonRegex = re `:`;

        string[] lines = newlineRegex.split(hibpRespBody);

        // Filter the lines to find the one that starts with the suffix
        string[] hits = lines.filter((line) => line.startsWith(suffix));

        if (hits.length() > 0) {
            // The password might be compromised
            string[] parts = colonRegex.split(hits[0]);
            if (parts.length() != 2) {
                return respondError(caller, 500, "external_error", "Invalid response from HIBP API.");
            }

            string passwordCount = parts[1];

            io:println("Password compromised count: ", passwordCount);

            // String cannot be converted for an unknown reason. Therefore, we are comparing the string.
            // TODO: Fix this issue
            if (passwordCount == "0") {
                check caller->respond({
                    actionStatus: "SUCCESS",
                    message: "Password is not compromised."
                });

                return;
            } else {
                // The password is compromised
                check caller->respond({
                    actionStatus: "FAILED",
                    failureReason: "password_compromised",
                    failureDescription: "The provided password is compromised."
                });

                return;
            }
        } else {
            // The password is not compromised
            check caller->respond({
                actionStatus: "SUCCESS",
                message: "Password is not compromised."
            });

            return;
        }
    }
}

function respondError(http:Caller caller, int status, string code, string desc) returns error? {
    http:Response errorResponse = new;
    errorResponse.setJsonPayload({
        actionStatus: "ERROR",
        errorDescription: desc
    });
    return caller->respond(errorResponse);
}
