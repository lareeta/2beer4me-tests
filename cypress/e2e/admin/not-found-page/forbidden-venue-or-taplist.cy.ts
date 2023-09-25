describe('non existent venue', { testIsolation: false }, () => {
  let signInLink = null
  let venueId = null
  let tapListId = null

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
  })

  it('creates venue', () => {
    cy.get('button').contains('Create venue').click()
    cy.location('pathname').should('match', /^\/admin\/venues\/([a-z0-9]+)$/)
    cy.location('pathname').then((path) => {
      venueId = path.split('/')[3]
    })
  })

  it('creates tap list', () => {
    cy.getByTestId('icon-tap-list-new').click()
    cy.getByTestId('to-taplist-button').click()
    cy.location('pathname').should(
      'match',
      /^\/admin\/venues\/([a-z0-9]+)\/taplists\/([a-z0-9]+)$/
    )
    cy.location('pathname').then((path) => {
      tapListId = path.split('/')[5]
    })
  })

  it('logs out', () => {
    cy.getByTestId('Header_ProfileButton').click()
    cy.contains('Logout').click()
    cy.url().should('eq', 'http://localhost:3000/api/auth/signin')
  })

  it('Enter your email address in the input and click on the sign in with email button', () => {
    cy.get('#input-email-for-email-provider').type('andretestingB@gmail.com')
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
  })

  it('returns 404 page for forbidden venue page', () => {
    const url = `http://localhost:3000/admin/venues/${venueId}`
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for forbidden qrcode page', () => {
    const url = `http://localhost:3000/admin/venues/${venueId}/qrcode`
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for forbidden taplists', () => {
    const url = `http://localhost:3000/admin/venues/${venueId}/taplists`
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for forbidden taplist', () => {
    const url = `http://localhost:3000/admin/venues/${venueId}/taplists/${tapListId}`
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for forbidden edit taplist page', () => {
    const url = `http://localhost:3000/admin/venues/${venueId}/taplists/${tapListId}/edit`
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })
})
