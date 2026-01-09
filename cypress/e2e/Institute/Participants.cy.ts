describe('Paricipants Management Tests', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false); // Ignore app JS errors

    // Step 1: Login
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Step 2: Navigate to Activities → Events
     cy.contains('span', 'Activities', { timeout: 20000 }).click({ force: true });
    cy.wait(1000);
   //cy.contains('Activities', { timeout: 30000 }).should('be.visible').click({ force: true });

   // cy.wait(1500);
    cy.contains('a', 'Participants').should('be.visible').click({ force: true });
  });

  it('should display the Participants page correctly', () => {      
    cy.url().should('include', '/participant/list'); // Verify correct page URL

    // Check that all table headers are visible
    cy.contains('Participant').should('be.visible');
    cy.contains('Credential').should('be.visible');
    cy.contains('Add Participant').should('be.visible');
  
    cy.contains('Other Actions').should('be.visible');
})
it('should display Add Participant form with all required fields', () => {
  // Click Add Participant button
  cy.contains('button', 'Add Participant', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true });
    cy.wait(2000);
    cy.get('input[id="eventName"]').click()
cy.contains('.MuiAutocomplete-option', 'EventNEW (123)').click();
//.scrollTo('bottom')
cy.contains('button', 'Download Template', { timeout: 30000 })
  .should('be.visible')
  .click({ force: true });

})
it('should upload participant file', () => {
  // Click Add Participant button
  cy.contains('button', 'Add Participant', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true });
    cy.wait(2000);
    cy.get('input[id="eventName"]').click()
cy.contains('.MuiAutocomplete-option', 'EventNEW (123)').click();
//.scrollTo('bottom')
// Upload file
const filePath = 'dummy_event_participants.xlsx';
cy.get('input[type="file"]').attachFile(filePath);  
cy.get('.MuiDialogActions-root > .MuiButtonBase-root > .MuiButton-label').click({ force: true });
cy.wait(5000);
//cy.contains('Participants added successfully').should('be.visible');
cy.get('input[id^="mui-"][class*="MuiAutocomplete-input"]')
  .click({ force: true });

// 2️⃣ Wait for dropdown options to appear
cy.get('.MuiAutocomplete-popper li', { timeout: 10000 })
  .eq(1) // select second option (index starts at 0)
  .click({ force: true });


});

})