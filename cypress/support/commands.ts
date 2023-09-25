import 'cypress-iframe'

/// <reference types="cypress" />
/// <reference types="cypress-iframe" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      getByTestId(testId: string): Chainable<JQuery<Element>>
    }
  }
}

Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

export {}
