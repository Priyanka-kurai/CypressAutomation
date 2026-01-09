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
// Navigate to Academic > Batches > Add Batch
 cy.contains('span', 'Academic', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
     cy.contains('span', 'Learners', { timeout: 15000 }).click({ force: true });
    cy.wait(1000);
   cy.contains('button', 'Add Learner').click({ force: true });
    cy.wait(1500);
  })
  
  
  it('Uploads learners via Bulk Upload', () => {
  // Click the Bulk Upload button (label)
    cy.contains('label', 'Bulk Upload Learners').click({ force: true });

  // Upload file
 cy.contains('button', 'Download Template').should('be.visible').click();
  })

/*it('Uploads learners via Bulk Upload', () => {
  // Click the Bulk Upload button (label)
  cy.contains('label', 'Bulk Upload Learners').click({ force: true });

    // Step 2: Wait for modal to be visible
    cy.get('.MuiDialog-container', { timeout: 10000 })
      .should('have.css', 'opacity', '1');

    // Step 3: Download Template (wait for visible)
   // cy.contains('button', 'Download Template', { timeout: 10000 })
     // .should('be.visible')
     // .click();

    // Step 4: Upload Excel file
    cy.get('input[type="file"][name="file"]').attachFile('dummy_student_data(1).xlsx');
     cy.wait(2000);
    // Step 5: Submit
    cy.contains('button', 'Submit').click({ force: true });

    // Step 6: Verify success message
    cy.contains('learners added successfully', { timeout: 15000 }).should('be.visible');

  // Verify success message
  //cy.contains('Upload successful',{ timeout: 10000 }).should('be.visible')
})*/


  it('TC009 - Upload Excel with missing mandatory column', () => {
     cy.contains('label', 'Bulk Upload Learners').click({ force: true });
    cy.get('input[type="file"][name="file"]').attachFile('missing_column.xlsx');
     cy.contains('button', 'Submit').click({ force: true });
   // cy.contains('Email column is required').should('be.visible');
  });

 /* it('TC012 - Upload corrupted Excel file', () => {
    cy.contains('label', 'Bulk Upload Learners').click({ force: true });
    cy.get('input[type="file"]').attachFile('corrupted.xlsx');
  cy.contains('button', 'Submit').click({ force: true });
    cy.contains('File cannot be read').should('be.visible');
  });

  it('TC017 - Click upload without selecting file', () => {
  cy.contains('button', 'Submit').click({ force: true });
    cy.contains('Please select a file').should('be.visible');
  });

  it('TC018 - Handle backend API failure gracefully', () => {
    cy.intercept('POST', '/api/upload', {
      statusCode: 500,
      body: { message: 'Server error' },
    });
    cy.get('input[type="file"]').attachFile('students_data.xlsx');
    cy.contains('button', 'Submit').click({ force: true });
    cy.contains('Upload failed, please try again').should('be.visible');
  });*/
});

  // Verify success message
  //cy.contains('Upload successful', { timeout: 10000 }).should('be.visible');



export {};