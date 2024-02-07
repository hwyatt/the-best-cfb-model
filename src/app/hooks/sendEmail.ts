import sgMail from "@sendgrid/mail";

// Check if the environment variable is defined
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SendGrid API key is not defined in environment variables.");
}

// Set your SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail: any = async (name: any, email: any, message: any) => {
  const msg = {
    to: "huntercwyatt@gmail.com", // Change to your email address
    from: "huntercwyatt@gmail.com", // Change to your verified sender
    subject: "New Message from Contact Form",
    text: `${name} (${email}) says: ${message}`,
    html: `<p>${name} (${email}) says:</p><p>${message}</p>`,
  };
  await sgMail.send(msg);
};
