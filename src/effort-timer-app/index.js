const effort_timer_app = 'effort_timer';


export default {
  app: effort_timer_app,
  title: 'Effort Timer',
  iconUrl: "https://cdn.glitch.global/7ab9dfdc-9274-473d-a0a7-466d1abed72e/clock.png?v=1653500930639",
  version: '0.0.2',
  dependencies: ['kustomer-^1.5.0'],
  description: 'This app can be used to track the amount of time that an agent is putting effort into a conversation. Starting the timer indicates that you are actively working on the open conversation. Stopping the timer indicates that you have finished working on a conversation for now.',
  appDetails: {
    appDeveloper: {
      name: 'Kustomer',
      website: 'https://kustomer.com',
      supportEmail: 'support@kustomer.com',
    }
  },
  settings: {
    default: {
      authToken: {
        type: 'secret',
        defaultValue: '',
        required: true
      },
      orgName: {
        type: 'string',
        defaultValue: '',
        required: true
      }
    }
  },
  i18n: {
    en_us: {
      [`${effort_timer_app}.settings.page.title`]: 'Effort Timer',
      [`${effort_timer_app}.settings.page.description`]: 'Configure settings for your Effort Timer app with Kustomer.',
      [`${effort_timer_app}.settings.path.default.authToken.displayName`]: 'Kustomer API Token',
      [`${effort_timer_app}.settings.path.default.authToken.description`]: "Please create an API Token with at least org.permission.conversation.update permissions.",
      [`${effort_timer_app}.settings.path.default.orgName.displayName`]: 'Organization',
      [`${effort_timer_app}.settings.path.default.orgName.description`]: "Enter the name of your org (found in the URL of your instance before _kustomerapp_)."
    }
  },
  actions: [
    {
      name: `kustomer.app.${effort_timer_app}.put-request`,
      type: 'rest_api',
      appSettings: {
        authToken: {
          key: `${effort_timer_app}.default.authToken`
        }
      },
      inputTemplate: {
        uri: '{{{orgName}}}.kustomerapp.com/v1/conversations/{{{conversationId}}}',
        method: 'PUT',
        headers: {
          authorization: 'Bearer {{{authToken}}}',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        data: {
          custom: {
            timerBool: false,
            conversationTimerEndAt: '{{{currentTime}}}',
            durationNum: '{{{durationNum}}}',
          }
        },
        json: true
      },
      inputSchema: {
        properties: {
          conversationId: {
            type: 'string'
          },
          currentTime: {
            type: 'string'
          },
          durationNum: {
            type: 'number'
          }
        },
        required: [
          'conversationId',
          'currentTime',
          'durationNum'
        ],
        additionalProperties: false
      },
      outputTemplate: {
        response: '/#response',
        body: '/#body'
      },
      outputSchema: {
        type: 'object',
        properties: {
          response: {
            type: 'object'
          },
          body: {
            type: 'object'
          }
        },
        additionalProperties: false
      }
    }
  ],
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
