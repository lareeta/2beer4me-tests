describe('age confirmation dialog', () => {
  beforeEach('opens the main page with the popup', () => {
    cy.clearCookies()
    cy.visit('http://localhost:3000')
    cy.getByTestId('AgeConfirmationDialog').contains(/(18 years)|(18 лет)/)
  })

  it('closes the popup by clicking YES and does not show after reload', () => {
    cy.getByTestId('AgeConfirmationDialog')
      .contains(/(Yes)|(Да)/)
      .click()
    cy.getByTestId('AgeConfirmationDialog').should('not.exist')
    cy.reload()
    cy.getByTestId('AgeConfirmationDialog').should('not.exist')
  })

  it('contains a button NO with the specified URL', () => {
    cy.getByTestId('AgeConfirmationDialog')
      .get('a')
      .contains(/(No)|(Нет)/)
      .should('have.attr', 'href', 'https://www.youtube.com/c/smeshariki')
  })
})
