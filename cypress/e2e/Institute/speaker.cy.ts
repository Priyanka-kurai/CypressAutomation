describe('Speaker Management Tests', () => {

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
 // Click on the "Add Speaker" button
cy.contains('Speakers').click({ force: true });



  });
    it('should display the Participants page correctly', () => {        
cy.url().should('include', '/speaker/list'); // Verify correct page URL

// Check that all table headers are visible
cy.contains('Speaker').should('be.visible');
cy.contains('Credentials').should('be.visible');
//cy.contains('Phone').should('be.visible');
cy.contains('Other Actions').should('be.visible');
    
})
it('should display Add Speaker form with all required fields', () => {
  // Click Add Speaker button
 cy.contains('button.MuiButton-root', 'Add Speaker')
  .should('be.visible')
  .click({ force: true });

// 1️⃣ Click on the "Select Event" autocomplete input
cy.get('input[id="eventName"]')
  .clear()
  .type('EventNEW', { delay: 100 }); // simulate user typing

// 2️⃣ Wait for the matching dropdown option and click it
cy.contains('.MuiAutocomplete-popper li', 'EventNEW')
  .should('be.visible')
  .click({ force: true });

cy.contains('button', 'Download Template').should('be.visible').click({ force: true });
})
it('should allow adding a new speaker', () => {
  // Click Add Speaker button 
        cy.contains('button', 'Add Speaker').click();
        cy.get('#eventName', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .click()
      .type('eventNew', { delay: 100 }); // Step 2: Type text slowly
     // Step 3: Wait for dropdown options to appear
     // cy.get('ul[role="listbox"] li', { timeout: 10000 }).should('be.visible').contains('tr')    .first()
     //.click({ force: true });// the visible text you want to select
       cy.get('body')
      .find('ul[role="listbox"] li')
      .should('exist')
      .first()
      .click({ force: true });
      cy.contains('button', 'Import Speakers File').click({ force: true });
cy.wait(2000);  
     //  cy.contains('button', 'Import Speakers File')
     // .should('be.visible')
     // .click();
    //  cy.contains('Submit').click({ force: true });

})

})
