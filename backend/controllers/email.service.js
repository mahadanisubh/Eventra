import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"Eventra Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Eventra Login OTP",
    html: `
      <div style="font-family: Arial; padding:20px">
        <h2>Eventra Login Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `,
  });
};
