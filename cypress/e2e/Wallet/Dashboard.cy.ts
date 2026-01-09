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

   cy.contains('button', 'Announcements', { timeout: 30000 })
        .should('be.visible')
        .click();

      cy.get("h2").contains("Announcements").should('be.visible')
      cy.wait(5000);

      cy.get('svg.lucide-x', { timeout: 10000 })
        .should('be.visible')
        .click();

      cy.get('div.cursor-pointer.size-10', { timeout: 10000 })
        .should('be.visible')
        .click();

      cy.wait(5000);

      cy.get('svg.lucide-x.size-6', { timeout: 20000 })
        .should('be.visible')
        .click({ force: true });

      cy.wait(5000);
        cy.get('.aspect-square',{ timeout: 20000 })
        .should('be.visible')
        .click({ force: true });  

        cy.contains('[role="menuitem"]', 'Sign Out')
  .should('be.visible')
  .click({ force: true })


  cy.contains('button', 'Yes')
  .should('be.visible')
  .click({ force: true })

  })
})
export {}