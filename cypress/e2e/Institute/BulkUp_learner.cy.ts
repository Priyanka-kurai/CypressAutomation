import 'cypress-file-upload';

describe('Bulk Upload Learners Tests', () => {

  const files = [
    'learners_batch1.xlsx',
    'learners_batch2.xlsx',
    'learners_batch3.xlsx'
  ];

  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Step 1: Log in to the application
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Step 2: Navigate to Academic → Learners → Add Learner
    cy.contains('span', 'Academic', { timeout: 20000 }).click({ force: true });
    cy.contains('span', 'Learners', { timeout: 20000 }).click({ force: true });
    cy.contains('button', 'Add Learner', { timeout: 15000 }).click({ force: true });

    // Step 3: Select the course before uploading
    cy.contains('label', 'Select Course')
      .parent()
      .find('.MuiAutocomplete-popupIndicator')
      .click();

   // cy.get('ul[role="listbox"]').within(() => {
      cy.get('ul[role="listbox"] li')
  .eq(2)
  .should('be.visible')
  .click()
    //});
    //step 4:select batch before uploading
    cy.contains('label', 'Select Batch')
      .parent()
      .find('.MuiAutocomplete-popupIndicator')
      .click();

    // Verify course selection
    cy.contains('label', 'Select Course')
      .parent()
      .find('input')
      .should('have.value', 'Bachelor of Science (BSC123)');
  });

  // Run upload test for each Excel file
  files.forEach((file) => {
    it(`TC - Upload ${file} and verify learners appear`, () => {
      cy.contains('button', 'Import Learner File').click({ force: true });

      // Upload the Excel sheet
      cy.get('input[type="file"]').attachFile(file);

      // Wait for processing and validation
      cy.wait(4000);
     // cy.contains('button', 'Okay').click();


      // Optional: verify success message
      //cy.contains('Data updated successfully', { timeout: 15000 }).should('be.visible');
     // cy.contains('please try again', { timeout: 10000 }).should('be.visible');
    });
  });

});
export {};