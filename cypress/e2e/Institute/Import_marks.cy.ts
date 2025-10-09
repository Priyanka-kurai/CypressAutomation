// cypress/e2e/import_marks_button.cy.js

describe('Import Marks Button Test', () => {

  beforeEach(() => {
  //  Cypress.on('uncaught:exception', () => false); // prevent test failure on app errors

    // Step 1: Log in and navigate to Learners page
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    // Replace with valid credentials
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('Tru@1234');
    cy.get('button[type=submit]').click();

    // Step 2: Wait and navigate to Learners section
    cy.contains('Learners', { timeout: 10000 }).click();
  });

  it('Clicks on Import Marks button successfully', () => {
    // Wait for the learners list to load
    cy.url().should('include', '/student/list');
    cy.wait(2000);

    // Step 3: Locate and click Import Marks button
    cy.get('button')
      .contains('Import Marks')
      .should('be.visible')
      .click();

    // Step 4: Validate if import modal or dialog opens
    cy.get('.MuiDialog-container', { timeout: 10000 }).should('be.visible');
  });

});
export {};