
import { list } from '@keystone-6/core';

import {
  text,
  relationship,
  password,
  timestamp,
  select,
  checkbox,
  integer
} from '@keystone-6/core/fields';

import { document } from '@keystone-6/fields-document';

import { Lists } from '.keystone/types';
import { isLoggedIn, isUserAdmin, isUserItem } from './access';
export const lists: Lists = {
  // Here we define the user list.
  User: list({
    // Here are the fields that `User` will have. We want an email and password so they can log in
    // a name so we can refer to them, and a way to connect users to posts.
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      // The password field takes care of hiding details and hashing values
      password: password({ validation: { isRequired: true } }),
      answer: relationship({ ref: 'Answer.user', many: true}),
      isAdmin: checkbox()
    },
    access: {
      operation: {
        query: () => true,
        create: () => true,
        delete: ({ session }) => isUserAdmin(session),
      },
      filter: {
        update: ({ session }) => isUserItem(session),
      }
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      labelField: 'name',
      listView: {
        initialColumns: ['name', 'email'],
      },
    },
  }),
  Question: list({
    fields: {
      question: text({ validation: { isRequired: true }}),
      type: relationship({ ref: 'Type.question'}),
      answer: relationship({ ref: 'Answer.question', many: true})
    },
    ui: {
      labelField: 'question',
      listView: {
        initialColumns: ['question']
      }
    },
    access: {
    operation: {
      query: () => true,
      create: ({ session }) => isUserAdmin(session),
      update: ({ session }) => isUserAdmin(session),
      delete: ({ session }) => isUserAdmin(session),
    }
   }
  }),
  Type: list({
    fields: {
      type: integer({ validation: { isRequired: true}}),
      subheading: text(),
      description: text({ ui: { displayMode: "textarea"}}),
      question: relationship({ ref: 'Question.type', many: true})
    },
    ui: {
      labelField: 'type',
      listView: {
        initialColumns: ['type', 'subheading']
      }
    },
    access: {
      operation: {
        query: () => true,
        create: ({ session }) => isUserAdmin(session),
        update: ({ session }) => isUserAdmin(session),
        delete: ({ session }) => isUserAdmin(session),
      }
     }
  }),
  Answer: list({
    fields: {
      answer: integer({ validation: { isRequired: true }}),
      user: relationship({ ref: 'User.answer'}),
      question: relationship({ ref: 'Question.answer'})
    },
    ui: {
      labelField:'answer',
      listView: {
        initialColumns:['answer', 'user', 'question']
      }
    },
    access: {
      operation: {
        query: ({ session }) => isLoggedIn(session),
        create: ({ session }) => isLoggedIn(session),
      },
      filter: {
        update: ({ session }) => isUserItem(session),
        delete: ({ session }) => isUserItem(session),
      }
     }
  })

};
