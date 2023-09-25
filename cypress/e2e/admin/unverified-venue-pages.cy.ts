describe('registration', { testIsolation: false }, () => {
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

  it('Click button create a new tap list', () => {
    cy.getByTestId('icon-tap-list-new').click()
  })

  it('Click the button To Tap List', () => {
    cy.getByTestId('to-taplist-button').click()
  })

  it('Contains Venue ID and TapList ID in the URL', () => {
    cy.location('pathname').should(
      'match',
      /^\/admin\/venues\/([a-z0-9]+)\/taplists\/([a-z0-9]+)$/
    )
    cy.location('pathname').then((path) => {
      venueId = path.split('/')[3]
      tapListId = path.split('/')[5]
    })
  })

  it('Redirects from public venue page to unverfied page', () => {
    cy.visit(`http://localhost:3000/venues/${venueId}`)
    cy.location('pathname').should('match', /^\/verification-required$/)
  })

  it('Redirects from TV menu to unverfied page', () => {
    cy.visit(`http://localhost:3000/board/${tapListId}`)
    cy.location('pathname').should('match', /^\/verification-required$/)
  })

  it('Redirects from TV menu to unverfied page', () => {
    cy.visit(`http://localhost:3000/admin/venues/${venueId}/qrcode`)
    cy.location('pathname').should('match', /^\/verification-required$/)
  })
})
