describe('registration', { testIsolation: false }, () => {
  let signInLink = null
  const beerNames = [
    'Guinness Draught',
    'Ace Pineapple Cider',
    'Delirium Red',
    'Rouge De Bruxelles Strong Red',
    'Zhigulevskoye / Жигулевское',
    'Northern Lights IPA',
    'Heineken',
    'Traditional Lager',
    'Kasteel Rouge',
    'Борщ Петровский',
  ]

  // Stop the test if a step fails
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress['runner'].stop()
    }
  })

  it('User visits the website  https://test.2beer4.me/admin', () => {
    cy.exec('yarn reset-database')
    cy.clearCookies()
    cy.visit('http://localhost:3000/admin')
  })

  it('Enter your email address in the input and click on the sign in with email button', () => {
    cy.get('#input-email-for-email-provider').type('andretestingA@gmail.com')
    cy.get('button[type=submit]').click()
    // ToDo: check result text
  })

  it('Get an email', () => {
    cy.request('http://localhost:1080/email').then((resp) => {
      const emails = resp.body
      const lastEmail = emails[emails.length - 1]
      const parser = new DOMParser()
      const doc = parser.parseFromString(lastEmail.html, 'text/html')

      cy.wrap(doc)
        .find('td > a')
        .invoke('attr', 'href')
        .then((link) => (signInLink = link))
    })
  })

  it('Follow the link', () => {
    cy.visit(signInLink)
    cy.url().should('eq', 'http://localhost:3000/admin/venues')
    cy.get('button').contains('Create venue')
    cy.getByTestId('Header_ProfileButton').click()
    cy.contains('andretestingA@gmail.com'.toLowerCase())
  })

  it('User visits the website  https://test.2beer4.me/admin/venues', () => {
    cy.visit('http://localhost:3000/admin/venues')
  })

  it('Click button Create venue', () => {
    cy.getByTestId('create-venue-button').click()
    cy.getByTestId('venue-selector-button')
  })

  //CREATE TAP LIST VENUE//
  it('Click button create a new tap list', () => {
    cy.getByTestId('icon-tap-list-new').click()
  })

  it('Enter a name in the Tap list name field', () => {
    cy.get('#name').clear().type('Test menu')
    cy.getByTestId('tap-list-left-menu').should('have.text', 'Test menu')
  })

  it('Click the button To Tap List', () => {
    cy.getByTestId('to-taplist-button').click()
  })

  it(
    'Enter in the field water Search a beer',
    { defaultCommandTimeout: 30000 },
    () => {
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid=beer-search-input] input')
          .clear()
          .type(beerNames[i])
        cy.get('[data-testid^=beer-search-result]')
          .contains(beerNames[i])
          .click()
        cy.get('tbody').contains(beerNames[i])
      }
    }
  )

  it('Remove one position of Борщ Петровский beer', () => {
    cy.get('tbody')
      .contains('Борщ Петровский')
      .parent()
      .within(() => {
        cy.getByTestId('MoreVertIcon').click()
      })
    cy.getByTestId('tap-context-menu').contains('Delete').click()
  })

  it('Swap beer positions', () => {
    cy.get('tbody')
      .contains('Guinness Draught')
      .parent()
      .within(() => {
        cy.get('input').clear().type('2')
      })
    cy.get('tbody')
      .contains('Ace Cider (The California Cider Company)')
      .parent()
      .within(() => {
        cy.get('input').clear().type('1')
      })
  })

  // it('Click the button TV Menu', () => {
  //   cy.get('a').contains('TV Menu').click()
  // })
})
