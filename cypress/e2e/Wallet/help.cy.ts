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

//Help
   cy.contains('a','Help', { timeout: 30000 })
      .should('be.visible')
      .click();

          cy.get('input[name="Name"]').type('Priya');
    })

    })

