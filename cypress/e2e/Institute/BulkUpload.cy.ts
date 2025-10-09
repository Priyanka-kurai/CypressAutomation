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

  // ✅ POSITIVE TEST CASES

  it('TC001 - Verify Bulk Upload button and template download', () => {
    cy.get('.MuiAutocomplete-popupIndicator').click();

    cy.contains('label', 'Bulk Upload Learners', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });
    cy.contains('button', 'Download Template', { timeout: 10000 }).should('be.visible');
  });

  it('TC002 - Upload valid Excel and verify learners appear in list', () => {
    cy.contains('label', 'Bulk Upload Learners').click({ force: true });

    // Initially submit button should be disabled
    cy.contains('button', 'Submit').should('be.disabled');

    // Upload valid Excel file
    cy.get('input[type="file"][name="file"]').attachFile('students_data.xlsx');

    // Wait for Submit button to enable
    cy.contains('button', 'Submit', { timeout: 10000 }).should('not.be.disabled');

    // Click Submit
    cy.contains('button', 'Submit').click({ force: true });

    // Wait for success message
    cy.contains('Data uploaded successfully', { timeout: 20000 }).should('be.visible');

    // ✅ Step 2: Go back to learner list and validate uploaded entries
    cy.wait(3000);
    cy.contains('button', 'Close').click({ force: true }); // Close modal if needed
    cy.wait(2000);

    // Refresh Learners list
    cy.contains('span', 'Learners').click({ force: true });
    cy.wait(5000);

    // Verify that the newly added learners exist in the table
    const learners = [
      'Amit Kumar',
      'Sneha Patil',
      'Ravi Sharma',
      'Priya Deshmukh'
    ];

    learners.forEach((name) => {
      cy.get('table', { timeout: 20000 }).should('contain.text', name);
    });
  });

  // ⚠️ NEGATIVE TEST CASES

  it('TC009 - Upload Excel missing mandatory column (Email)', () => {
    cy.contains('label', 'Bulk Upload Learners').click({ force: true });

    cy.contains('button', 'Submit').should('be.disabled');
    cy.get('input[type="file"][name="file"]').attachFile('missing_column.xlsx');
    cy.contains('button', 'Submit', { timeout: 10000 }).should('not.be.disabled');

    cy.contains('button', 'Submit').click({ force: true });
    cy.contains('Email column is required', { timeout: 10000 }).should('be.visible');
  });

  it('TC012 - Upload corrupted Excel file', () => {
    cy.contains('label', 'Bulk Upload Learners').click({ force: true });

    cy.contains('button', 'Submit').should('be.disabled');
    cy.get('input[type="file"][name="file"]').attachFile('corrupted.xlsx');
    cy.contains('button', 'Submit', { timeout: 10000 }).should('not.be.disabled');

    cy.contains('button', 'Submit').click({ force: true });
    cy.contains('File cannot be read', { timeout: 10000 }).should('be.visible');
  });

  it('TC017 - Try submitting without selecting any file', () => {
    cy.contains('label', 'Bulk Upload Learners').click({ force: true });
    cy.contains('button', 'Submit').should('be.disabled');
  });

  it('TC018 - Handle backend API failure gracefully', () => {
    // Intercept upload API to simulate 500 error
    cy.intercept('POST', '/api/upload', {
      statusCode: 500,
      body: { message: 'Server error' },
    });

    cy.contains('label', 'Bulk Upload Learners').click({ force: true });

    cy.contains('button', 'Submit').should('be.disabled');
    cy.get('input[type="file"][name="file"]').attachFile('students_data.xlsx');
    cy.contains('button', 'Submit', { timeout: 10000 }).should('not.be.disabled');

    cy.contains('button', 'Submit').click({ force: true });
    cy.contains('Upload failed, please try again', { timeout: 10000 }).should('be.visible');
  });
});
export {};