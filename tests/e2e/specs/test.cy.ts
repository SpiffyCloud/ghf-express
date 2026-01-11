describe('Barcode flow', () => {
  it('lets a user enter and save a barcode', () => {
    cy.clearLocalStorage()
    cy.visit('/')

    cy.contains('Enter your membership ID')
    cy.get('button[aria-label="save"]').should('be.disabled')

    ;['1', '2', '3', '4', '5', '6'].forEach((digit) => {
      cy.get('.key').contains(digit).click()
    })

    cy.get('button[aria-label="save"]').should('not.be.disabled').click()
    cy.contains('button', 'Delete')
    cy.get('#barcode').should('exist')
  })
})
