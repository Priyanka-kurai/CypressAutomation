
import 'cypress-file-upload';

describe('Bulk Upload Learners Tests', () => {

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
  });


it('TC002 - Upload valid Excel and verify learners appear in list', () => {
cy.contains('label', 'Select Course').parent() .find('.MuiAutocomplete-popupIndicator').click();
cy.get('ul[role="listbox"]')//.scrollTo('bottom');
    cy.contains('li', 'Bachelor of Science (BSC123)', { timeout: 5000 }).click();
    // Assert Program input contains selected value
cy.contains('label', 'Select Course').parent().find('input').should('have.value', 'Bachelor of Science (BSC123)');
 cy.contains('button', 'Import Learner File').click();

    // Attach the Excel or CSV file to the file input
    // (Assuming a file input appears after clicking the button)
    cy.get('input[type="file"]').attachFile('students_data_dummy.xlsx');

 })

    
    
    
    
})

