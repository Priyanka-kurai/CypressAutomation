describe('TruScholar Wallet — Complete End-to-End Resume Flow', () => {

  it('should log in, open settings and view plans successfully', () => {

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


    cy.contains('a', 'Settings')
  .scrollIntoView()   // scrolls to make sure it's visible
  .should('be.visible') // confirms it's visible before clicking
  .click();            // performs the click

cy.wait(1000);
 cy.contains('button', 'Explore Plans', { timeout: 10000 })
  .should('be.visible')
  .and('not.be.disabled')
  .click()

cy.wait(1000);





cy.contains('a', 'Settings').click({ force: true }) 
cy.wait(500)
  cy.contains('button', 'Reset Now').click();

  cy.get('input[name="currentPassword"]')
      .clear() // clear the existing value ("10")
      .type('Sushil@23'); // type new password

   /* cy.get('input[name="newPassword"]')
      .clear()
      .type('Sushil@22');

    cy.get('input[name="confirmPassword"]')
      .should('be.visible') // make sure it’s visible
      .type('Sushil@22');   // type the confirmation password  
    //cy.contains('button', 'Submit').click();//    cy.contains('button', 'Submit').click();
    cy.wait(2000);
    cy.contains('Password updated').should('be.visible');*/

})


})
export {}

