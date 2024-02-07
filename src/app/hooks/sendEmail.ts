import sgMail from "@sendgrid/mail";

sgMail.setApiKey(
  `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`
);

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
