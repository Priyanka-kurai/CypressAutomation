describe('Activity Management Tests', () => {

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
    cy.contains('span', 'Events', { timeout: 20000 }).click({ force: true });
    cy.wait(1500);
  });

 /* // ✅ Test 1: Verify the Activities (Events) Page
  it('should display the Activities (Events) page correctly', () => {
    cy.url().should('include', '/event/list'); // Verify correct page URL

    // Check that all table headers are visible
    cy.contains('Event Code').should('be.visible');
    cy.contains('Event Name').should('be.visible');
    cy.contains('Duration').should('be.visible');
    cy.contains('Template Name').should('be.visible');
    cy.contains('Actions').should('be.visible');

    // Assert the Add Event button is visible and enabled
    cy.contains('button', 'Add Event')
      .should('be.visible')
      .and('not.be.disabled');
  });

  // ✅ Test 2: Verify Add Event Form Elements
  it('should display Add Event form with all required fields', () => {
    // Click Add Event button
    cy.contains('button', 'Add Event', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });

    // Wait for the modal to appear
    cy.contains('Add New Event', { timeout: 10000 }).should('be.visible');

    // Assert all important form fields are visible
    cy.contains('Event Name').should('be.visible');
    cy.contains('label', 'Event Name') .parent().find('input') .should('exist').and('be.enabled'); // example selector

    cy.contains('Event Description').should('be.visible');
   cy.get('textarea[name="description"]').should('exist').and('be.enabled');


    cy.contains('Event Type').should('be.visible');
    cy.contains('label', 'Event Type')
  .parent()
  .find('[role="button"]')
  .should('exist')
  .and('be.visible');


   // cy.contains('Duration').should('be.visible');
   // cy.get('input[name="duration"]').should('exist').and('be.enabled');

    cy.contains('Skills Set').should('be.visible');
    cy.get('#Skills')
  .should('exist')
  .and('be.visible')
  .and('be.enabled');

    cy.contains('Name').should('be.visible');
    cy.contains('Designation').should('be.visible');

    // Verify Save / Submit button exists and enabled
  cy.contains('button', 'Add Event & select Certificate')
  .should('exist')
  .and('be.visible')
  .and('not.be.disabled');

    // Optional: Close the form and verify modal disappears
  //  cy.contains('button', 'Cancel').click({ force: true });
 //   cy.contains('Add New Event').should('not.exist');
  });

  // ✅ Test 3: Validate that the user stays logged in between tests
  it('should remain logged in when navigating again', () => {
    cy.contains('span', 'Dashboard', { timeout: 10000 }).should('be.visible');
    cy.contains('span', 'Events', { timeout: 10000 }).click();
    cy.url().should('include', '/event/list');
  });
it('verify event name validation',()=>{
  cy.contains('button', 'Add Event', { timeout: 15000 })
      .should('be.visible')         
        .click({ force: true });                                                
        cy.wait(2000);
  cy.contains('label', 'Event Name')
  .parent()
  .find('input')
  .type('!@#$', { force: true });

      //  cy.contains('Invalid event name').should('be.visible');
}   )
it('validate for empty form submission',()=>{
  cy.contains('button', 'Add Event', { timeout: 15000 })
      .should('be.visible')         
        .click({ force: true });                                                
        cy.wait(2000);
        cy.contains('button', 'Add Event & select Certificate')
  .should('be.visible')
  .and('not.be.disabled')
  .click({ force: true });
        cy.wait(2000);
        cy.contains('Cannot be empty').should('be.visible'); 
}   );*/
it('fill all details in add event form',()=>{
  cy.contains('button', 'Add Event', { timeout: 15000 })
      .should('be.visible')     
        .click({ force: true });                                                
        cy.wait(2000);
        cy.contains('label', 'Event Name')
  .parent()
  .find('input')
  .type('EventNEW', { force: true }); 

cy.contains('label', 'Event Code')
  .parent()
  .find('input')
  .should('exist')
  .and('be.visible')
  .and('be.enabled')
  .type('123');
    cy.wait(2000);
    // Open the Event Type dropdown
cy.contains('label', 'Event Type')
  .parent()
  .find('[role="button"]')
  .should('be.visible')
  .click({ force: true });

// Wait for options to appear
cy.get('li', { timeout: 5000 }).should('exist');

// Select one option from the dropdown
cy.get('li').contains('Workshop').click();

// Verify selected option displayed
cy.get('#eventType').should('contain.text', 'Workshop');

// Type in the Skills Set input
cy.get('#Skills')
  .should('be.visible')
  .and('be.enabled')
  .type('tes');
cy.wait(1000);
// Select 1st dropdown value
cy.get('ul[role="listbox"] > li')
  .eq(0)
  .click();

// Type again to reopen dropdown
cy.get('#Skills').type('tes');

// Select 2nd dropdown value
cy.get('ul[role="listbox"] > li')
  .eq(2)
  .click();

// Verify at least 2 skills are selected (Material UI chips)
cy.get('.MuiChip-label')
  .should('have.length.at.least', 2)
  .and('be.visible');
cy.contains('label', 'Event Description')
  .parent()
  .find('textarea[name="description"]')
  .should('exist')
  .and('be.visible')
  .and('be.enabled')
  .type('Join us for an engaging physical seminar designed to provide valuable insights and hands-on learning from industry experts. This in-person session will focus on sharing practical knowledge, interactive discussions, and networking opportunities.');
cy.contains('label', /^Name\s*\*/)
  .scrollIntoView()
  .parent()
  .find('input')
  .clear()
  .type('Asmita')
  .should('have.value', 'Asmita');

    cy.wait(1000);
    cy.contains('label', 'Designation')
      .parent() // go to parent div     
      .find('input') // find the input inside
      .type('Tester');
    cy.wait(1000);
    cy.contains('button', 'Add Event & select Certificate')
  .should('be.visible')
  .and('not.be.disabled')
  .click({ force: true });
  cy.wait(3000);
//Step 1: Click the Activity tab
cy.contains('button', /^Activity$/)
  .should('be.visible')
  .click({ force: true });
  cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardMedia-root', { timeout: 10000 })
  .should('be.visible')
  .trigger('mouseover', { force: true });

//cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardMedia-root')
  //.trigger('mouseover', { force: true });

//cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root').click({ force: true });
cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiGrid-justify-xs-space-between > .MuiGrid-grid-xs-2 > .MuiButtonBase-root > .MuiButton-label').click({ force: true });


cy.contains('label', /^Select event$/)
  .parent()                  // Move to the parent container
  .find('input, div[role="button"]') // Find the select trigger
  .click();
cy.wait(1000);
cy.get('ul[role="listbox"] > li')
  .eq(0) // Select the first option   
  .click();
cy.wait(2000);
cy.get('#assignTo')
  .parents('.MuiAutocomplete-inputRoot')
  .find('.MuiAutocomplete-popupIndicator')
  .should('exist')
  .click({ force: true });

// 3️⃣ Wait for dropdown to render
cy.get('ul[role="listbox"]', { timeout: 5000 })
  .should('be.visible');

// 4️⃣ Select a specific participant (example: "John Doe")
cy.get('ul[role="listbox"] li')
  .eq(1) // Select the first option   
  .click();
cy.wait(1000);

cy.get('.MuiButton-textPrimary > .MuiButton-label')
  .click({ force: true });
 
cy.contains('Certificate Updated').should('be.visible');

})
})
export {}
