describe('TruScholar Wallet — Complete End-to-End Resume Flow', () => {

  it('should log in, open Student Support in same tab, and fill the name field', () => {

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

    // === Step 2: Click Help link (Student Support) ===
    // Remove the 'target' attribute so the link opens in the same tab
    cy.contains('a', 'Help', { timeout: 30000 })
      .should('be.visible')
      .invoke('removeAttr', 'target')  // ✅ Forces same-tab navigation
      .click();

    // === Step 3: Fill the Name field ===
    cy.origin('https://www.truscholar.io/student-support', () => {
      cy.get('input[name="Name"]', { timeout: 20000 })
        .should('be.visible')
        .type('Priya');


         cy.get('input[name="Email"]')
      .should('be.visible')
      .type('Priyakurai222@gmail.com')
      .should('have.value', 'Priyakurai222@gmail.com')

          cy.get('input[name="Mobile No "]')
      .should('be.visible')
      .type('9359668065')
      .should('have.value', '9359668065')

          cy.get('input[name="University Name"]')
      .should('be.visible')
      .type('Utkal University')
      .should('have.value', 'Utkal University')

        cy.get('textarea[name="Message"]')
      .should('be.visible')
      .type('Hi, I’m unable to log in to my student portal. It says “invalid credentials” even though my password is correct. Could you please help me reset my account access?')
      .should('have.value', 'Hi, I’m unable to log in to my student portal. It says “invalid credentials” even though my password is correct. Could you please help me reset my account access?')
     cy.wait(2000)  
      cy.contains('button', 'Submit').click({ force: true })
    });
  });
});
export {}