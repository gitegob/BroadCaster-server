import transporter, { emailTemplate } from '../config/mailerConfig';
import upload from '../config/cloudConfig';

export const sendEmail = async (to, name, title, status, type) => {
  // let color;
  // if (status.toLowerCase() === 'pending') color = 'orange';
  // else if (status.toLowerCase() === 'resolved') color = 'green';
  // else color = 'red';
  // const color2 = type.toLowerCase() === 'intervention' ? 'brown' : 'rgb(98, 52, 226)';
  const html = emailTemplate(name, status, title);
  // const html = `<h2 style="text-align:center; font-family:verdana;">Hi ${name},</h2>
  // <p style="text-align:center;font-family:verdana;">The status of your record with title</p><pre style="display:block;text-align:center;background-color:${color2};color:whitesmoke;padding:.1rem .3rem;border-radius:3px;width:fit-content;">${title}</pre><p style="text-align:center;font-family:verdana;">has been set to </p><pre style="display:block;color:${color};text-transform:uppercase;text-align:center">${status}</pre>`,
  const msg = {
    from: '"BroadCaster" <noreply@broadcaster.com>',
    to,
    subject: 'Update from Broadcaster',
    html,
  };
  try {
    const resp = await transporter.sendMail(msg);
    return resp;
  } catch (error) {
    return error.message;
  }
};

export const feedbackSender = async (email, name, feedback) => {
  const msg = {
    from: `"${name}" <${email}>`,
    to: 'gitegob7@gmail.com',
    subject: 'Feedback from Broadcaster',
    html: `
    <p style="text-align:center; font-family:verdana;">
    <h2>Hi Brian Gitego, You have feedback from Broadcaster</h2>
    <p>${feedback}</p>
    </p>
    `,
  };
  try {
    const resp = await transporter.sendMail(msg);
    return resp;
  } catch (error) {
    return error.message;
  }
};

export const uploadFile = async (req) => {
  const { dp = '' } = req.files || {};
  const pic = Array.isArray(dp) ? dp[0] : dp;
  const cloudFile = await upload(pic);
  return cloudFile;
};
