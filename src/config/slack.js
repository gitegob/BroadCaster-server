import Axios from 'axios';
import { debugApp, debugError } from './debug';
import env from './env';

const notifySlack = async (e) => {
  if (env.NODE_ENV === 'production') {
    const res = await Axios.post('https://slack.com/api/chat.postMessage', {
      channel: 'error-handling',
      text: `${e}`,
    }, { headers: { authorization: `Bearer ${env.SLACK_TOKEN}`, 'Content-Type': 'application/json' } }).catch((error) => debugError(error));
    debugApp('Slack Notification', res.data);
  }
};

export default notifySlack;
