import { cli } from "cypress";

describe('Add New Batch Form Tests', () => {
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

    cy.contains('span', 'Curriculum', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
    cy.contains('Batches').click();

    cy.wait(1000);
    cy.contains('button', 'Add Batch').click();
    cy.wait(1500);
  })
    
  it('Verify mandatory field validation', () => {
    cy.get('#submitCourse').click();
  //  cy.contains('Program is required');
   // cy.contains('Course is required');
    cy.contains('Cannot be empty');
   cy.contains('Cannot be empty');
   // cy.contains('Start Date is required');
   // cy.contains('End Date is required');
  });
 it('Verify Program dropdown selection', () => {
    cy.contains('label', 'Program')
  .parent()
  .find('.MuiAutocomplete-popupIndicator')
  .click();

// Scroll dropdown list to bottom
cy.get('ul[role="listbox"]').scrollTo('bottom');
    cy.contains('li', 'Data Analytics Diploma', { timeout: 5000 }).click();
    // Assert Program input contains selected value
cy.contains('label', 'Program').parent().find('input').should('have.value', 'Data Analytics Diploma (DIP404)');

  });
    it('Verify Course dropdown selection', () => {

 cy.contains('label', 'Program').parent().find('.MuiAutocomplete-popupIndicator') .click();

// Scroll dropdown list to bottom
cy.get('ul[role="listbox"]').scrollTo('bottom');
    cy.contains('li', 'Data Analytics Diploma', { timeout: 5000 }).click();
    // Assert Program input contains selected value
cy.contains('label', 'Program').parent().find('input').should('have.value', 'Data Analytics Diploma (DIP404)');
cy.contains('label', 'Select Course').parent() .find('.MuiAutocomplete-popupIndicator').click();
cy.get('ul[role="listbox"]')//.scrollTo('bottom');
    cy.contains('li', 'Bachelor of Science (BSC123)', { timeout: 5000 }).click();
    // Assert Program input contains selected value
cy.contains('label', 'Select Course').parent().find('input').should('have.value', 'Bachelor of Science (BSC123)');
 })
  it('Verify Batch Name input accepts valid values', () => {
    cy.contains('label', 'Batch Name').parent().find('input').type('Batch Alpha');

    cy.contains('label', 'Batch Name').parent().find('input').should('have.value', 'Batch Alpha');
  });
//
  it('Verify Batch Name rejects invalid input', () => {
   cy.contains('label', 'Batch Name').parent().find('input').type('123@#');
    cy.contains('Invalid batch name').should('be.visible');
  });

  it('Verify Batch Code accepts valid input', () => {
  cy.contains('label', 'Batch Code').parent().find('input').type('BC-101');

cy.contains('label', 'Batch Code').parent().find('input').should('have.value', 'BC-101');
  });

  it('Verify Batch Code rejects invalid input', () => {
     cy.contains('label', 'Batch Code').parent().find('input').type('@#$%^');
    cy.contains('Invalid batch code').should('be.visible');
  });

 it('Verify Start Date selection', () => {
cy.contains('label', 'Start Date') .parent().find('input[type="date"]').invoke('val', '2025-09-15') .trigger('change');

  
cy.contains('label', 'End Date') .parent().find('input[type="date"]').invoke('val', '2025-09-20') .trigger('change');

  })
it('Verify End Date cannot be earlier than Start Date', () => {
 
// Set Start Date
cy.contains('label', 'Start Date').parent().find('input[type="date"]').clear().type('2025-10-01');

// Set End Date
cy.contains('label', 'End Date').parent().find('input[type="date"]') .clear().type('2025-10-03');

// Verify Duration auto-updates to 2 days
cy.contains('label', 'Duration').parent().find('input[disabled]').should('have.value', '2 days ');
})



it('Verify Protected PDF toggle (Yes/No)', () => {
  // Get the toggle input
 // Grab all toggles, pick the 2nd one (index 1)
cy.get('input.MuiSwitch-input').eq(1).as('secondToggle');


// Interact with it
cy.get('@secondToggle').check({ force: true });
cy.get('@secondToggle').should('be.checked');



// Click the dropdown arrow (popup indicator)
cy.get('#passwordType')
  .parent() // move up to the input wrapper
.find('.MuiAutocomplete-popupIndicator').click();
//cy.get('#passwordType').type('Certificate');
//cy.contains('li', 'Certificate').click();  // select from the dropdown list

// Assert Password Type input contains selected value
//cy.get('#passwordType').should('have.value', 'Certificate');
//cy.get('#passwordType').type('Certifi{downarrow}{enter}');

//cy.get('#passwordType').click().type('Certifi{downarrow}{enter}');

// Verify value selected
cy.get('#passwordType').should('have.value', 'Certificate')
.click();





//cy.contains('li', 'Certificate').click();

cy.get('[style="margin-top: 10px; gap: 20px; align-items: center;"] > .MuiGrid-container > :nth-child(2) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root')
  .should('be.visible')
  .click({ force: true });
// Step 1: Click inside the autocomplete field


cy.focused().clear().type('Full Name', { delay: 100 });

// Step 3: Wait for the dropdown list and select the option
cy.get('ul[role="listbox"] li')
  .contains('Full Name')
  .click({ force: true });

// Step 4: Verify that "Full Name" is selected
//cy.get('#passwordType').should('have.value', 'Full Name');
cy.get('#submitCourse') .should('be.visible').click();



cy.contains('Batch created successfully').should('be.visible');
})

  it('should create a batch successfully with valid data', () => {
    // ---- Select Program ----
    cy.contains('label', 'Program')
      .parent()
      .find('.MuiAutocomplete-popupIndicator')
      .click();
    cy.contains('li', 'Data Analytics Diploma', { timeout: 5000 }).click();
    cy.contains('label', 'Program')
      .parent()
      .find('input')
      .should('have.value', 'Data Analytics Diploma (DIP404)');

    // ---- Select Course ----
    cy.contains('label', 'Select Course')
      .parent()
      .find('.MuiAutocomplete-popupIndicator')
      .click();
    cy.contains('li', 'Bachelor of Science (BSC123)', { timeout: 5000 }).click();
    cy.contains('label', 'Select Course')
      .parent()
      .find('input')
      .should('have.value', 'Bachelor of Science (BSC123)');

    // ---- Fill Batch Name ----
    cy.contains('label', 'Batch Name')
      .parent()
      .find('input')
      .type('Batch Alpha');
    cy.contains('label', 'Batch Name')
      .parent()
      .find('input')
      .should('have.value', 'Batch Alpha');

    // ---- Fill Batch Code ----
    cy.contains('label', 'Batch Code')
      .parent()
      .find('input')
      .type('BC-101');
    cy.contains('label', 'Batch Code')
      .parent()
      .find('input')
      .should('have.value', 'BC-101');
cy.wait(1000);
    // ---- Set Start Date ----
    cy.contains('label', 'Start Date')
      .parent()
      .find('input[type="date"]')
      .invoke('val', '2025-10-01')
      .trigger('change');

    // ---- Set End Date ----
    cy.contains('label', 'End Date')
      .parent()
      .find('input[type="date"]')
      .invoke('val', '2025-10-01')
      .trigger('change');

    // ---- Verify Duration Auto-Update ----
    cy.contains('label', 'Duration')
      .parent()
      .find('input[disabled]')
      .should('have.value', '1 days ');

    // ---- Enable Protected PDF Toggle ----
    cy.get('input.MuiSwitch-input').eq(1).as('protectedToggle');
    cy.get('@protectedToggle').check({ force: true });
    cy.get('@protectedToggle').should('be.checked');

    // ---- Select Password Type ----
    cy.get('#passwordType')
      .parent()
      .find('.MuiAutocomplete-popupIndicator')
      .click();
   cy.contains('li', 'Certificate', { timeout: 5000 })
  .should('be.visible')
  .click({ force: true });
    cy.get('#passwordType').should('have.value', 'Certificate');

    // ---- Select Password Field ----
    cy.get(
      '[style="margin-top: 10px; gap: 20px; align-items: center;"] > .MuiGrid-container > :nth-child(2) > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
      .should('be.visible')
      .click({ force: true });

    cy.focused().clear().type('Full Name', { delay: 100 });
    cy.get('ul[role="listbox"] li')
      .contains('Full Name')
      .click({ force: true });

    // ---- Submit the Form ----
    cy.get('#submitCourse').should('be.visible').click();

    // ---- Verify Success Message ----
    cy.contains('Batch Added Succesfully', { timeout: 10000 }).should('be.visible');
  });
})

export { };