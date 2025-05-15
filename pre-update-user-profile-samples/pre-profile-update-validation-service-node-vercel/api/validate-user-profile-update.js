const nodemailer = require('nodemailer');
require("dotenv").config();

// Mock: valid department list (simulating a directory check)
const validDepartments = ["Engineering", "HR", "Sales", "Finance"];
const VALID_API_KEY = process.env.API_KEY; // Replace with your actual key

// Email transporter config using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Helper to extract claim values
const getClaimValue = (claims, uri) => {
    const claim = claims.find(c => c.uri === uri);
    return claim ? claim.value : null;
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Validate API key from headers
    const apiKey = req.headers['api-key'];
    if (!apiKey || apiKey !== VALID_API_KEY) {
        return res.status(401).json({
            actionStatus: 'FAILED',
            failureReason: 'unauthorized',
            failureDescription: 'Invalid or missing API key.',
        });
    }

    const payload = req.body;

    const claims = payload?.event?.request?.claims || [];
    const userId = payload?.event?.user?.id || "Unknown User";

    const department = getClaimValue(claims, "http://wso2.org/claims/department");
    const email = getClaimValue(claims, "http://wso2.org/claims/emailaddress");
    const phone = getClaimValue(claims, "http://wso2.org/claims/mobile");

    // Department validation
    if (department && !validDepartments.includes(department)) {
        return res.status(200).json({
            actionStatus: "FAILED",
            failureReason: "invalid_department_input",
            failureDescription: "Provided user department value is invalid."
        });
    }

    // Send security alert email if sensitive attributes are being updated
    const changes = [];
    if (department) changes.push(`Department: ${department}`);
    if (email) changes.push(`Email: ${email}`);
    if (phone) changes.push(`Phone: ${phone}`);

    const fromEmailAddress = process.env.FROM_EMAIL;
    const toEmailAddress = process.env.TO_EMAIL;

    if (changes.length > 0) {
        try {
            await transporter.sendMail({
                from: `"Security Alert" <${fromEmailAddress}>`,
                to: toEmailAddress,
                subject: "Sensitive Attribute Update Request",
                text: `User ${userId} is attempting to update:\n\n${changes.join("\n")}`
            });
        } catch (error) {
            console.error("Failed to send security email:", error);
            return res.status(200).json({
                actionStatus: "FAILED",
                failureReason: "email_error",
                failureDescription: "Failed to notify security team about sensitive data update."
            });
        }
    }

    return res.status(200).json({ actionStatus: "SUCCESS" });
};
