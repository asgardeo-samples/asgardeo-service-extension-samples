import express from "express";
import crypto from "node:crypto";
import validator from "validator";
import axios from "axios";
import { json } from "express";
import util from "util";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(json({ limit: "100kb" }));

// Logging utility
const logRequest = (req) => {
    console.log("Request Received", {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: util.inspect(req.body, { depth: null }),
    });
};

const logResponse = (req, resBody) => {
    console.log("Response Sent", {
        url: req.originalUrl,
        responseBody: util.inspect(resBody, { depth: null }),
    });
};

app.get("/", (req, res) => {
    logRequest(req);
    const response = { message: "Service is running.", status: "ok" };
    logResponse(req, response);
    res.json(response);
});

app.post("/passwordcheck", async (req, res) => {
    logRequest(req);
    try {
        if (!validator.isJSON(JSON.stringify(req.body))) {
            const response = {
                actionStatus: "ERROR",
                error: "invalid_request",
                errorDescription: "Invalid JSON payload.",
            };
            logResponse(req, response);
            return res.status(400).json(response);
        }

        const cred = req.body?.event?.user?.updatingCredential;
        if (!cred || cred.type !== "PASSWORD") {
            const response = {
                actionStatus: "ERROR",
                error: "invalid_credential",
                errorDescription: "No password credential found.",
            };
            logResponse(req, response);
            return res.status(400).json(response);
        }

        // Handle encrypted (base64-encoded) or plain text passwords
        let plain = cred.value;
        if (cred.format === "HASH") {
            try {
                plain = Buffer.from(cred.value, "base64").toString("utf8");
            } catch {
                const response = {
                    actionStatus: "ERROR",
                    error: "invalid_credential",
                    errorDescription: "Expects the encrypted credential.",
                };
                logResponse(req, response);
                return res.status(400).json(response);
            }
        }

        const sha1 = crypto.createHash("sha1").update(plain).digest("hex").toUpperCase();
        const prefix = sha1.slice(0, 5);
        const suffix = sha1.slice(5);

        const hibpResp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: {
                "Add-Padding": "true",
                "User-Agent": "hibp-demo",
            },
        });

        const hitLine = hibpResp.data
            .split("\n")
            .find((line) => line.startsWith(suffix));

        const count = hitLine ? parseInt(hitLine.split(":")[1], 10) : 0;

        if (count > 0) {
            const response = {
                actionStatus: "FAILED",
                failureReason: "password_compromised",
                failureDescription: "The provided password is compromised.",
            };
            logResponse(req, response);
            return res.status(200).json(response);
        }

        const response = { actionStatus: "SUCCESS" };
        logResponse(req, response);
        return res.status(200).json(response);
    } catch (err) {
        console.error("Service Error: ", err);
        const status = err.response?.status || 500;
        const msg =
            status === 429
                ? "External HIBP rate limit hit—try again in a few seconds."
                : err.message || "Unexpected server error";
        const response = { error: msg };
        logResponse(req, response);
        res.status(status).json(response);
    }
});

app.listen(PORT, () => {
    console.log(
        `Pre-password update service started on http://localhost:${PORT}` +
        "\npress Ctrl+C to stop"
    );
});

export default app;
