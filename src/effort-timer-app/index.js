const effort_timer_app = 'effort-timer-app';


export default {
  app: effort_timer_app,
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
      [`${effort_timer_app}.settings.page.title`]: 'Effort Timer',
      [`${effort_timer_app}.settings.page.description`]: 'Configure settings for your Effort Timer app with Kustomer.',
    }
  },
  kviews: [
    {
      resource: 'conversation',
      template: "<div> <DynamicCard src=\"https://sunny-forested-galleon.glitch.me/\" fillToWidth noPadding context={context}/></div>",
      context: 'smartbar-card',
      meta: {
        displayName: `Effort Timer`,
        icon: 'clock'
      },
      name: `kustomer.app.${effort_timer_app}.timer-card`
    }
  ],
};
