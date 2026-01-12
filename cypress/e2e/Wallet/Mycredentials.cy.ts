describe('TruScholar Wallet — Complete End-to-End Resume Flow', () => {

  it('should log in, open my credentials', () => {

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

    // === Step 2: Go to My Credentials ===
    cy.contains('a', 'My Credentials', { timeout: 30000 })
      .should('be.visible')
      .click();

    cy.url({ timeout: 20000 }).should('include', '/credentials');

    // === ✅ Assertion: Check that at least one certificate exists ===


    // === Step 3: View a certificate ===
cy.get('a', { timeout: 30000 })
  .filter(':contains("View")')   // find all <a> with text 'View'
  .should('have.length.at.least', 3) // ensure at least 2 exist
  .eq(2)                         // select the 2nd one (index starts at 0)
  .click();



    // Wait for certificate page to load
    cy.contains('button', 'Copy Verification Link', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.wait(2000);
    cy.url().should('include', '/certificates/');

    // === Step 4: Download certificate ===
    cy.contains('button', 'Download', { timeout: 30000 })
      .should('be.visible')
      .click();

  });
});
export {}
