import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const api_key = process.env.BREVO_API_KEY;
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = api_key;

export async function sendEmail(
    toEmail,
    subject = "Test Mail",
    htmlContent = "<h1>Hello ben sakaryaya gidiyorum</h1>"
) {
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailData = {
        sender: {
            name: "Kumru",
            email: "bahaddinkumru7@gmail.com",
        },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
    };

    console.log("email neyse gelen:", toEmail);

    try {
        const response = await tranEmailApi.sendTransacEmail(emailData);
        console.log("Mail gönderildi:", response);
    } catch (err: any) {
        console.error("Hata oluştu:", err.response?.body || err.message);
    }
}
