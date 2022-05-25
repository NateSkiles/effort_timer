const effortTimerApp = 'effort_timer';


export default {
 app: effortTimerApp,
 title: 'Effort Timer',
 version: '0.0.1',
 dependencies: ['kustomer-^1.5.0'],
 description: 'This app can be used to track the amount of time that an agent is putting effort into a conversation. Starting the timer indicates that you are actively working on the open conversation. Stopping the timer indicates that you have finished working on a conversation for now.',
 appDetails: {
   appDeveloper: {
     name: 'Kustomer',
     website: 'https://kustomer.com',
     supportEmail: 'support@kustomer.com',
   }
 },
 i18n: {
    en_us: {
      [`${effortTimerApp}.settings.page.title`]: 'Effort Timer',
      [`${effortTimerApp}.settings.page.description`]: 'Configure settings for your Effort Timer app with Kustomer.',
    }
  },
};