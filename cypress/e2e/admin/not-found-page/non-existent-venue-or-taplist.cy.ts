describe('non existent venue', { testIsolation: false }, () => {
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

  it('returns 404 page for non existent venue page', () => {
    const url = 'http://localhost:3000/admin/venues/1234567891234567891234567'
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for non existent qrcode page', () => {
    const url =
      'http://localhost:3000/admin/venues/1234567891234567891234567/qrcode'
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for non existent taplists', () => {
    const url =
      'http://localhost:3000/admin/venues/1234567891234567891234567/taplists'
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for non existent taplist', () => {
    const url =
      'http://localhost:3000/admin/venues/1234567891234567891234567/taplists/1234567891234567891234567'
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })

  it('returns 404 page for non existent edit taplist page', () => {
    const url =
      'http://localhost:3000/admin/venues/1234567891234567891234567/taplists/1234567891234567891234567/edit'
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })
})
