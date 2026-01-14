describe('Barcode flow', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // Ensure we always start on the keypad view.
        win.localStorage.clear()
      },
    })
  })

  function enterBarcode(digits: string[]) {
    digits.forEach((digit) => {
      cy.get('.key').contains(digit).click()
    })
  }

  it('lets a user enter and save a barcode', () => {
    cy.contains('Enter your membership ID')
    cy.get('button[aria-label="save"]').should('be.disabled')

    enterBarcode(['1', '2', '3', '4', '5', '6'])

    cy.get('button[aria-label="save"]').should('not.be.disabled').click()
    cy.contains('button', 'Delete')
    cy.get('#barcode').should('exist')
  })

  it('persists the barcode across reload', () => {
    enterBarcode(['1', '2', '3', '4', '5', '6'])
    cy.get('button[aria-label="save"]').click()
    cy.get('#barcode').should('exist')

    cy.reload()
    cy.get('#barcode').should('exist')
    cy.contains('Enter your membership ID').should('not.exist')
  })

  it('allows editing after saving', () => {
    enterBarcode(['9', '8', '7', '6', '5', '4'])
    cy.get('button[aria-label="save"]').click()
    cy.get('#barcode').should('exist')

    cy.get('button[aria-label="edit barcode"]').click()
    cy.contains('Enter your membership ID')
    cy.get('button[aria-label="save"]').should('not.be.disabled')
    cy.get('button[aria-label="id number"]').first().should('contain', '9')
  })

  it('backspace removes digits and can disable save again', () => {
    cy.get('button[aria-label="save"]').should('be.disabled')

    enterBarcode(['1', '2', '3', '4', '5', '6'])

    cy.get('button[aria-label="save"]').should('not.be.disabled')
    cy.get('button[aria-label="backspace"]').click()
    cy.get('button[aria-label="save"]').should('be.disabled')
  })

  it('deletes the barcode from the barcode view', () => {
    enterBarcode(['1', '2', '3', '4', '5', '6'])
    cy.get('button[aria-label="save"]').click()
    cy.get('#barcode').should('exist')

    cy.get('button[aria-label="delete barcode"]').click()
    cy.contains('Delete Barcode', { includeShadowDom: true }).click()

    cy.contains('Enter your membership ID')
    cy.get('#barcode').should('not.exist')
  })
})
