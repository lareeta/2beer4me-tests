describe('registration', { testIsolation: false }, () => {
  let signInLink = null
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

  //CREATE FIRST VENUE //
  it('User visits the website  https://test.2beer4.me/admin/venues', () => {
    cy.visit('http://localhost:3000/admin/venues')
  })

  it('CLICK BUTTON', () => {
    cy.getByTestId('create-venue-button').click()
  })

  it('Fill in all the VENUE fields non valid', () => {
    cy.get('input[id=name]').clear().type('35985467!@"+_??<L       r')
    cy.get('input[id=website]')
      .clear()
      .type('https://untappd.com/v/ontap/7809158')
    cy.get('input[id=phone]').clear().type('80000000000')
    cy.get('input[id=country]').clear().type('%(*:%')
    cy.get('input[id=state]').clear().type('=дыв388лHJJDJBHhifdk')
    cy.get('input[id=city]').clear().type('лвUB(*&402?>>>')
    cy.get('input[id=address]').clear().type('ldjgяв089w0=, дом 24?.27')
    cy.get('input[id=latitude]').clear().type('gg.93831953кв!№25')
    cy.get('input[id=longitude]').clear().type('--.35джА")498583977')

    // Select picture
    cy.get('input[type=file][name=image]').selectFile(
      'cypress/fixtures/example.json',
      { force: true }
    )

    // Select finance info
    cy.get('input[id="currencyCode"]')
      .type('брл')
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
})

//document.querySelectorAll('')
