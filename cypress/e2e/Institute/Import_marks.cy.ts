import 'cypress-file-upload';
describe('Add New Batch Form Tests', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();
    cy.wait(15000);
// Navigate to Academic > Batches > Add Batch
 cy.contains('span', 'Academic', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
     cy.contains('span', 'Learners', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);



    cy.contains('label', 'Filter by Program')
  .parent()
  .find('input')
  .clear()
  .type('Program for Travolic', { delay: 100 })

cy.get('ul[role="listbox"]')
  .contains('li', 'Program for Travolic (12)')
  .click()
cy.contains('label', 'Select Course')
      .parent()
      .find('.MuiAutocomplete-popupIndicator')
      .click();

  cy.get('ul[role="listbox"] li')
  .eq(0) // index starts from 0 → eq(1) = second element
  .click({ force: true });

    // Verify course selection
    //cy.contains('label', 'Select Course').parent().find('input').should('have.value', 'Bachelor of Science (BSC123)');

      //cy.get('label')
      //.contains('Select Batch').parent().find('input').should('be.visible').click({ force: true });            
cy.contains('label', 'Select Batch')
  .parent()
  .find('input')
  .should('be.visible')
  .click({ force: true });
    // Optional: verify dropdown menu opened
      

cy.get('body').then(($body) => {
  if ($body.find('ul[role="listbox"] li').length > 0) {
    cy.get('ul[role="listbox"] li').eq(1).click({ force: true });
  } else {
    // Retry clicking dropdown if it didn’t open initially
    cy.log('Dropdown not opened yet, retrying...');
    cy.contains('label', 'Select Batch')
      .parent()
      .find('input')
      .click({ force: true });


  

   //  cy.get('ul[role="listbox"] li')
  //.eq(1) // index starts from 0 → eq(1) = second element
  //.click({ force: true });
  }
  })
})

  it('Clicks on Import Marks button successfully', () => {
    // Wait for the learners list to load
    cy.url().should('include', '/student/list');
    cy.wait(2000);

    // Step 3: Locate and click Import Marks button
   // Click the "Import Marks" button
cy.contains('label', 'Import Marks')
  .should('be.visible')
  .click({ force: true });


    // Step 4: Validate if import modal or dialog opens
    cy.get('.MuiDialog-container', { timeout: 10000 }).should('be.visible');
    // Click the "Download Prefilled Template" button
cy.contains('button', 'Download Prefilled Template')
  .should('be.visible')
  .click({ force: true });

  });
it('imports marks via Excel file upload', () => {
cy.contains('label', 'Import Marks')
  .should('be.visible')
  .click({ force: true });
 cy.get('.MuiDialog-container', { timeout: 10000 }).should('be.visible');
   cy.get('input[type="file"][name="file"]')
      .should('exist')
      .attachFile('import_marks_dummy.xlsx');
        cy.wait(2000);

        cy.contains('button', 'Submit')
  .should('be.visible')
  .click({ force: true });
      cy.wait(2000);
});
it('validates error handling for invalid file upload', () => {
cy.contains('label', 'Import Marks')
  .should('be.visible')
  .click({ force: true });
 cy.get('.MuiDialog-container', { timeout: 10000 }).should('be.visible');
   cy.get('input[type="file"][name="file"]')
      .should('exist')
      .attachFile('invalid_file.txt');
        cy.wait(2000);

        cy.contains('button', 'Submit')
  .should('be.visible')
  .click({ force: true });
      cy.wait(4000);
      cy.contains('Uploaded document is empty').should('be.visible');
      cy.contains('Failed to upload marks').should('be.visible');
})      
it('closes the import modal when Cancel button is clicked', () => {
cy.contains('label', 'Import Marks')
  .should('be.visible')
  .click({ force: true });
 cy.get('.MuiDialog-container', { timeout: 10000 }).should('be.visible');
 cy.contains('button', 'Cancel')
  .should('be.visible')
  .click({ force: true });
  cy.get('.MuiDialog-container').should('not.exist');
})  
 it('marks the learners list after import', () => {
    // Wait for the learners list to load
cy.contains('label', 'Select Batch')
  .parent()
  .find('input')
  .should('be.visible')
  .click({ force: true });
    // Optional: verify dropdown menu opened
      cy.wait(1000);
cy.get('[role="listbox"] [role="option"]')
.eq(1).click() // index starts from 0 → eq(1) = second element | ^ 41 | .click({ force: true });
    cy.url().should('include', '/student/list');
    cy.wait(2000);

    cy.get('input[type="checkbox"]')
  .first()                 // click the first checkbox (you can change the index)
  .check({ force: true }); // force:true helps with hidden styled inputs

})
})
export {};