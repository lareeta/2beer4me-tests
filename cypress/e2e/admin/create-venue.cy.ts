describe('registration', { testIsolation: false }, () => {
  let signInLink = null
  let venueId = null

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

  //CREATE FIRST VENUE//
  it('User visits the website  https://test.2beer4.me/admin/venues', () => {
    cy.visit('http://localhost:3000/admin/venues')
  })

  it('CLICK BUTTON', () => {
    cy.getByTestId('create-venue-button').click()
  })

  it('Contains Venue ID in the URL', () => {
    cy.location('pathname').should('match', /^\/admin\/venues\/([a-z0-9]+)$/)
    cy.location('pathname').then((path) => {
      venueId = path.split('/')[3]
    })
  })

  it('Fill in all the VENUE fields valid', () => {
    cy.get('input[id=name]').clear().type('TestNameBar')
    cy.get('input[id=website]')
      .clear()
      .type('https://untappd.com/v/ontap/7809158')
    cy.get('input[id=phone]').clear().type('+79118112845')
    cy.get('input[id=country]').clear().type('Russia')
    cy.get('input[id=state]').clear().type('Saint-Petersburg')
    cy.get('input[id=city]').clear().type('Saint-Petersburg')
    cy.get('input[id=address]').clear().type('Vosstaniya Street, house 24/27')
    cy.get('input[id=latitude]').clear().type('59.93831953431225')
    cy.get('input[id=longitude]').clear().type('30.358488498583977')

    // Select value from dropdown Venue type
    // cy.get('#venueType').click()
    // cy.get('#menu-venueType li').eq(1).click()

    // Select picture
    cy.get('input[type=file][name=image]').selectFile(
      'cypress/fixtures/venue-image.png',
      { force: true }
    )

    // Select finance info
    cy.get('input[id="currencyCode"]')
      .type('BRL')
      .type('{downArrow}')
      .type('{enter}')
  })

  it('Select value from dropdown Venue type', () => {
    cy.get('#venueType').click()
    cy.get('#menu-venueType li').eq(1).click()
    cy.wait(5000) //to do нужно перехватывать запрос
  })

  it('updating the website', () => {
    cy.reload()
  })

  it('Verifies the venue', () => {
    cy.task('verifyVenue', venueId)
  })

  it('User visits the website https://test.2beer4.me/', () => {
    cy.visit(`http://localhost:3000/venues/${venueId}`)

    cy.getByTestId('venue-name').should('have.text', 'TestNameBar')
    cy.getByTestId('venue-address').should(
      'have.text',
      'Vosstaniya Street, house 24/27'
    )
    cy.getByTestId('venue-location').should(
      'have.text',
      'Saint-Petersburg, Saint-Petersburg'
    )
    cy.getByTestId('venue-country').should('have.text', 'Russia')
    cy.getByTestId('venue-phone').should('have.text', '+79118112845')
  })
})
