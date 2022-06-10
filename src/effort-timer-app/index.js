const effort_timer_app = 'effort_timer';

export default {
  app: effort_timer_app,
  title: 'Effort Timer',
  iconUrl: "https://cdn.glitch.global/7ab9dfdc-9274-473d-a0a7-466d1abed72e/clock.png?v=1653500930639",
  version: '0.1.0',
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
  klasses: [{
    "name": "conversation",
    "metadata": {
      "standard": true,
      "properties": {
        "timerBool": {
          "displayName": "Timer Boolean",
          "example": "True/False"
        },
        "durationNum": {
          "displayName": "Timer Duration",
          "example": "Sum of timer duration"
        },
        "timerEndAt": {
          "displayName": "Conversation Timer Start Time",
          "example": ""
        },
        "timerStartAt": {
          "displayName": "Conversation Timer Start Time",
          "example": ""
        },
      }
    }
  }],
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
          key: `effort_timer.default.authToken`
        },
        orgName: {
          key: `effort_timer.default.orgName`
        }
      },
      inputTemplate: {
        uri: 'https://{{orgName}}.api.kustomerapp.com/v1/conversations/{{conversationId}}',
        method: 'PUT',
        headers: {
          authorization: 'Bearer {{authToken}}',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        data: {
          custom: {
            "@effotim2TimerBool": false,
            "@effotim2TimerEndAt": '{{currentTime}}',
            "@effotim2DurationNum": '/#durationNum',
          }
        },
        json: true
      },
      inputSchema: {
        type: "object",
        properties: {
          conversationId: { type: 'string' },
          currentTime: { type: 'string' },
          durationNum: { type: 'number' },
        },
        required: [
          'conversationId',
          'currentTime',
          'durationNum',
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
  workflows: [
    {
      "description": "",
      "name": "effort-timer-1-of-4",
      "steps": [
        {
          "transitions": [
            {
              "target": "3dvtbCHY4",
              "condition": {
                "op": "eq",
                "values": [
                  "/#steps.1.changes.attributes.custom.after.@effotim2TimerBool",
                  true
                ]
              },
              "meta": {
                "name": "Timer Started"
              }
            }
          ],
          "errorCases": [],
          "id": "DbjygSb7h"
        },
        {
          "transitions": [],
          "errorCases": [],
          "id": "3dvtbCHY4",
          "action": "kustomer.app.scheduler.schedule-workflow",
          "params": {
            "runAt": {
              "value": 10,
              "type": "relative"
            },
            "workflowId": "629806ce83f4a07ef11e0c76",
            "inputs": {
              "conversationId": "/#steps.1.id",
              "@effotim2TimerStartAt": "/#steps.1.changes.attributes.custom.after.@effotim2TimerStartAt"
            }
          },
          "appVersion": "scheduler-^1.0.1"
        }
      ],
      "trigger": {
        "transitions": [
          {
            "target": "DbjygSb7h",
            "condition": {
              "op": "or",
              "values": [
                {
                  "op": "eq",
                  "values": [
                    "/#steps.1.changes.custom.attributes.before.@effotim2TimerBool",
                    false
                  ]
                },
                {
                  "op": "dne",
                  "values": [
                    "/#steps.1.changes.attributes.custom.before.@effotim2TimerBool",
                    true
                  ]
                }
              ]
            },
            "meta": {
              "name": "Timer Not Set"
            }
          }
        ],
        "eventName": "kustomer.conversation.update",
        "id": "1",
        "appVersion": "kustomer-^1.9.2"
      }
    },
    {
      "description": "",
      "id": "629806ce83f4a07ef11e0c76",
      "name": "effort-timer-30-minutes-2-of-4",
      "steps": [
        {
          "transitions": [
            {
              "target": "ZjnrKj6AM",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "BZZJOr1Jk",
          "action": "kustomer.note.create",
          "appVersion": "kustomer-^1.9.2",
          "params": {
            "conversation": "/#steps.1.conversationId",
            "body": "Your timer has been running for 30 minutes."
          }
        },
        {
          "transitions": [
            {
              "target": "BZZJOr1Jk",
              "condition": {
                "op": "and",
                "values": [
                  {
                    "op": "eq",
                    "values": [
                      "/#steps.DFtlTaetT.custom.@effotim2TimerBool",
                      true
                    ]
                  },
                  {
                    "op": "eq",
                    "values": [
                      "/#steps.DFtlTaetT.custom.@effotim2TimerStartAt",
                      "/#steps.1.@effotim2TimerStartAt"
                    ]
                  }
                ]
              },
              "meta": {
                "name": "Same Timer"
              }
            }
          ],
          "errorCases": [],
          "id": "DFtlTaetT",
          "action": "kustomer.conversation.find-by-id",
          "params": {
            "id": "/#steps.1.conversationId"
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [],
          "errorCases": [],
          "id": "ZjnrKj6AM",
          "action": "kustomer.app.scheduler.schedule-workflow",
          "params": {
            "runAt": {
              "value": 10,
              "type": "relative"
            },
            "workflowId": "6298070dd1689c70089fb57e",
            "inputs": {
              "conversationId": "/#steps.1.conversationId",
              "@effotim2TimerStartAt": "/#steps.1.@effotim2TimerStartAt"
            }
          },
          "appVersion": "scheduler-^1.0.1"
        }
      ],
      "trigger": {
        "transitions": [
          {
            "target": "DFtlTaetT",
            "condition": {
              "op": "true",
              "values": [
                true
              ]
            }
          }
        ],
        "id": "1",
        "callable": true,
        "schema": {
          "properties": {
            "conversationId": {
              "type": "string"
            },
            "@effotim2TimerStartAt": {
              "type": "string"
            }
          },
          "required": [
            "conversationId",
            "@effotim2TimerStartAt"
          ]
        },
        "eventName": "kustomer.workflow.629806ce83f4a07ef11e0c76.call"
      }
    },
    {
      "description": "",
      "id": "6298070dd1689c70089fb57e",
      "name": "effort-timer-60-minutes-3-of-4",
      "steps": [
        {
          "transitions": [
            {
              "target": "xEMM1c58l",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "Yt1aQsVIT",
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [
            {
              "target": "iVeoA7IDx",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "xEMM1c58l",
          "action": "kustomer.note.create",
          "params": {
            "conversation": "/#steps.xRmOuTLR0.id",
            "body": "Your timer has been running for 60 minutes."
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [
            {
              "target": "Yt1aQsVIT",
              "condition": {
                "op": "and",
                "values": [
                  {
                    "op": "eq",
                    "values": [
                      "/#steps.xRmOuTLR0.custom.@effotim2TimerBool",
                      true
                    ]
                  },
                  {
                    "op": "eq",
                    "values": [
                      "/#steps.xRmOuTLR0.custom.@effotim2TimerStartAt",
                      "/#steps.1.@effotim2TimerStartAt"
                    ]
                  }
                ]
              },
              "meta": {
                "name": "Same Timer Check"
              }
            }
          ],
          "errorCases": [],
          "id": "xRmOuTLR0",
          "action": "kustomer.conversation.find-by-id",
          "params": {
            "id": "/#steps.1.conversationId"
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [],
          "errorCases": [],
          "id": "iVeoA7IDx",
          "action": "kustomer.app.scheduler.schedule-workflow",
          "params": {
            "runAt": {
              "value": 10,
              "type": "relative"
            },
            "workflowId": "62980740565f5020cf3ab2dc",
            "inputs": {
              "conversationId": "/#steps.1.conversationId",
              "effotim2TimerStartAt": "/#steps.1.@effotim2TimerStartAt"
            }
          },
          "appVersion": "scheduler-^1.0.1"
        }
      ],
      "trigger": {
        "transitions": [
          {
            "target": "xRmOuTLR0",
            "condition": {
              "op": "true",
              "values": [
                true
              ]
            }
          }
        ],
        "id": "1",
        "callable": true,
        "schema": {
          "properties": {
            "conversationId": {
              "type": "string"
            },
            "@effotim2TimerStartAt": {
              "type": "string"
            }
          },
          "required": [
            "conversationId",
            "@effotim2TimerStartAt"
          ]
        },
        "eventName": "kustomer.workflow.6298070dd1689c70089fb57e.call"
      }
    },
    {
      "description": "",
      "id": "62980740565f5020cf3ab2dc",
      "name": "effort-timer-stop-timer-4-of-4",
      "steps": [
        {
          "transitions": [
            {
              "target": "CKByP6iLV",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "Z4L303Fyn",
          "action": "kustomer.user.find-by-id",
          "params": {
            "id": "/#steps.SoXxw6grv.assignedUsers.0"
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [
            {
              "target": "anHK7NH4C",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "CKByP6iLV",
          "action": "kustomer.note.create",
          "params": {
            "conversation": "/#steps.SoXxw6grv.id",
            "body": "**Stopping Timer**\n\nYour timer has been running for 4 hours, please restart timer if your you're still working on this conversation. ",
            "userMentions": [
              { "user": "/#steps.Z4L303Fyn.id" }
            ]
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [
            {
              "target": "ibyRPoEGn",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "anHK7NH4C",
          "action": "kustomer.regex-match.generic",
          "params": {
            "testString": "{{{date 'hours' count=0}}}",
            "regex": ".*"
          },
          "meta": {
            "displayName": "Current Time"
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [
            {
              "target": "so7kOHPqH",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "ibyRPoEGn",
          "action": "kustomer.regex-match.generic",
          "params": {
            "testString": "{{dateDiff 'milliseconds' from=steps.SoXxw6grv.custom.@effotim2TimerStartAt to=steps.anHK7NH4C.match}}",
            "regex": ".*"
          },
          "appVersion": "kustomer-^1.9.2",
          "meta": {
            "displayName": "Find Current Duration"
          }
        },
        {
          "transitions": [
            {
              "target": "SvQ1uaTpl",
              "condition": {
                "op": "true",
                "values": [
                  true
                ]
              }
            }
          ],
          "errorCases": [],
          "id": "so7kOHPqH",
          "action": "kustomer.regex-match.generic",
          "params": {
            "testString": "{{ math steps.ibyRPoEGn.match \"+\" steps.SoXxw6grv.custom.@effotim2DurationNum }}",
            "regex": ".*"
          },
          "meta": {
            "displayName": "Sum Total Duration"
          },
          "appVersion": "kustomer-^1.9.2"
        },
        {
          "transitions": [],
          "errorCases": [],
          "id": "SvQ1uaTpl",
          "action": "kustomer.app.effort_timer_6142bf2f6ef1940524f53d94.put-request",
          "params": {
            "durationNum": "/#fn:parseInt,steps.so7kOHPqH.match",
            "currentTime": "/#fn:dateFormat,steps.anHK7NH4C.match",
            "conversationId": "/#steps.1.conversationId"
          },
          "appVersion": "effort_timer_6142bf2f6ef1940524f53d94-^0.0.30"
        },
        {
          "transitions": [
            {
              "target": "Z4L303Fyn",
              "condition": {
                "op": "and",
                "values": [
                  {
                    "op": "eq",
                    "values": [
                      "/#steps.SoXxw6grv.custom.@effotim2TimerBool",
                      true
                    ]
                  },
                  {
                    "op": "eq",
                    "values": [
                      "/#steps.SoXxw6grv.custom.@effotim2TimerStartAt",
                      "/#steps.1.@effotim2TimerStartAt"
                    ]
                  }
                ]
              },
              "meta": {
                "name": "Same Timer Check"
              }
            }
          ],
          "errorCases": [],
          "id": "SoXxw6grv",
          "action": "kustomer.conversation.find-by-id",
          "params": {
            "id": "/#steps.1.conversationId"
          },
          "appVersion": "kustomer-^1.9.2"
        }
      ],
      "trigger": {
        "transitions": [
          {
            "target": "SoXxw6grv",
            "condition": {
              "op": "true",
              "values": [
                true
              ]
            }
          }
        ],
        "id": "1",
        "callable": true,
        "eventName": "kustomer.workflow.62980740565f5020cf3ab2dc.call",
        "schema": {
          "properties": {
            "conversationId": {
              "type": "string"
            },
            "@effotim2TimerStartAt": {
              "type": "string"
            }
          },
          "required": [
            "conversationId",
            "@effotim2TimerStartAt"
          ]
        }
      }
    }
  ]
};
