describe('TruScholar Wallet — Complete End-to-End Resume Flow', () => {

  it('should log in, open TruResume, and fill resume form successfully', () => {

    // === Setup ===
    cy.viewport(1200, 700);
    cy.visit('https://wallet.truscholar.io/signin');

    // === Step 1: Login ===
    cy.get('input[name="email"]', { timeout: 20000 })
      .should('be.visible')
      .type('starishita9900@gmail.com');

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .type('Sushil@23');

    cy.get('button[type="submit"]').should('be.visible').click();

    // Wait for dashboard to load
    cy.contains('Dashboard', { timeout: 40000 }).should('be.visible');

    cy.contains('button', 'Jobs', { timeout: 20000 })
  .should('be.visible')
  .click()
cy.wait(500)
cy.contains('a', 'Explore')
  .should('be.visible')
  .click()
cy.url().should('include', '/jobs/find')

cy.get('.items-center > .relative > .jsx-226ef366f5e770aa').type('QA')
cy.wait(500)
cy.get('[role="combobox"], [aria-haspopup="listbox"]')
  .filter(':visible')
  .first()
  

  .type('Pune'); // type inside the combobox input

// Wait for the dropdown (listbox) to appear
cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');

// Select the "Pune" option
cy.contains('[role="option"]', 'Pune')
  .should('be.visible')
  .click();
cy.contains('button', 'Apply →')
  .should('be.visible')
  .click();

})
})
export {}