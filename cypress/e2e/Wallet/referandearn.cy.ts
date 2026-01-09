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

    cy.contains('a', 'Refer and Earn', { timeout: 30000 })
      .should('be.visible')
      .click();


    // Scroll to and click the "Copy Code" element
cy.contains('p', 'Copy Code')
  .scrollIntoView()   // 👈 scrolls until it's visible
  .should('be.visible') // optional check for visibility
  .click();            // clicks the element

      cy.wait(2000)  
cy.contains('h3', 'See Benefits').click();
cy.wait(500)  
//cy.get('[data-cy="benefits-button"]').click();

  })
})