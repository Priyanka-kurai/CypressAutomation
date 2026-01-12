
describe('certidicate issuance Form Tests', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();
// Navigate to Academic > Batches > Add Batch
     cy.contains('span', 'Academic', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
     cy.contains('span', 'Certificates', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
   //  cy.contains('a', 'Certificates').click();
  })

it ('TC001 - Verify certificate issuance page elements', () => {
  //cy.contains('button', 'Add Certificate Template').should('be.visible').click({ force: true });
  cy.contains('button', 'Add Learner').should('be.visible')
  cy.wait(1500);
  
})
it ('import data button is enabled or disabled', () => {
  //cy.contains('button', 'Import Data').should('be.visible').and('be.disabled')
  cy.wait(1500);
})
it ('click on import data button', () => {
 cy.contains('span', 'Import Data')
  .should('be.visible')
  .click({ force: true });

  cy.wait(1500);
})
it ('download template button', () => {
     cy.contains('span', 'Import Data')
  .should('be.visible')
  .click({ force: true });
cy.contains('button', 'Download Prefilled Template')
  .should('be.visible')
  .click({ force: true });
  cy.wait(3000);
})
it ('upload excel file', () => {
     cy.contains('span', 'Import Data')
  .should('be.visible')
  .click({ force: true });
  //cy.contains('button', 'Upload Excel File').should('be.visible').click({ force: true });
  cy.wait(2000);    
//cy.get('input[type="file"]').attachFile('certificate_data.xlsx');
  cy.wait(3000);
})
})
export {}