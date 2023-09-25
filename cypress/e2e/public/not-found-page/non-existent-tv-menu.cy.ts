describe('non existent TV menu', () => {
  it('returns 404 page', () => {
    const url = 'http://localhost:3000/board/1234567891234567891234567'
    cy.request({ url, failOnStatusCode: false })
      .its('status')
      .should('equal', 404)
    cy.visit(url, { failOnStatusCode: false })
  })
})
