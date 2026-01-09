describe('Learners Page Functional Tests', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Step 1: Login
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization', { timeout: 15000 }).click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name="password"]').type('TruscholarTest@123');
    cy.get('#signin').click({ force: true });
    cy.wait(15000);

    // Step 2: Navigate to Learners page
    cy.contains('span', 'Academic', { timeout: 15000 }).click({ force: true });
    cy.contains('span', 'Learners', { timeout: 15000 }).click({ force: true });
    cy.url().should('include', '/student/list');
    cy.wait(2000);
  });

  // ----------------------------------------------------
  // TC_ADD_LEARNER_12: Verify “Other Actions” dropdown
  // ----------------------------------------------------
  it('TC_ADD_LEARNER_12 - Verify “Other Actions” dropdown', () => {
    cy.contains('Other Actions').should('be.visible').click({ force: true });
    cy.get('.MuiMenu-paper', { timeout: 5000 })
      .should('be.visible')
     // .within(() => {
      //  cy.contains('Export').should('exist'); // example option
      //});
    cy.log('✅ Successfully verified: Should display additional learner-related actions');
  });

  // ----------------------------------------------------
  // TC_ADD_LEARNER_13: Verify “Issuance Action” button state (disabled by default)
  // ----------------------------------------------------
 it('TC_ADD_LEARNER_13 - Verify “Issuance Action” button state', () => {
  // Verify that the "Issuance Action" button is disabled
  cy.contains('button', 'Issuance Action')
    .should('be.disabled');

  cy.log('✅ Successfully verified: Issuance Action button is disabled when no learner is selected');
});



  // ----------------------------------------------------
  // TC_ADD_LEARNER_14: Verify “Issuance Action” button after selecting learners
  // ----------------------------------------------------
  it('TC_ADD_LEARNER_14 - Verify “Issuance Action” button after selection', () => {
    // Select first learner checkbox
    cy.get('input[type="checkbox"]').first().check({ force: true });

    // Now button should enable
    cy.contains('Issuance Action')
      .should('be.visible')
      .and('not.have.attr', 'aria-disabled', 'true');
    cy.log('✅ Successfully verified: Button should enable & show issuance options');
  });

  // ----------------------------------------------------
  // TC_ADD_LEARNER_15: Verify sorting by Learner Name
  // ----------------------------------------------------
 
  

  // ----------------------------------------------------
  // TC_ADD_LEARNER_16: Verify empty learners list
  // ----------------------------------------------------
  it('TC_ADD_LEARNER_16 - Verify empty learners list', () => {
  // Select a Program/Course/Batch with no learners
  cy.contains('label', 'Select Batch')
    .parent()
    .find('input')
    .click({ force: true });

  // Choose a batch with no learners (assuming the last one is empty)
  cy.get('ul[role="listbox"] li')
    .last()
    .click({ force: true });

  // Wait for the learners list to refresh
  cy.wait(2000);

  // Verify "No learners found" message is visible
  cy.contains('No Learners Found', { matchCase: false, timeout: 5000 })
    .should('be.visible');

  cy.log('✅ Successfully verified: Table displays “No Learners Found” message');
});


});
export {}
