import sgMail from '../config/mailerConfig';

const sendEmail = async (to, name, title, status) => {
  const msg = {
    to,
    from: '"BroadCaster" <noreply@broadcaster.com>',
    subject: 'Update from Broadcaster',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<b>Hi ${name}</b><br>
        Your record with title <b style="color:#333333;">${title}</b> status has been set to <b style="color:#333333;text-transform:uppercase;">${status}</b>`,
  };
  await sgMail.send(msg);
};
export default sendEmail;
