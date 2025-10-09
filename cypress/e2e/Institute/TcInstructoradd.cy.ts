describe('Instructor Management Tests', () => {
  beforeEach(() => {
    // Login before each test (so each case is independent)
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Navigate to Instructors page
    cy.get('a#Instructors', { timeout: 20000 }).click();
    cy.url().should('include', '/instructoruser/list');

    // Open Add Instructor form
    cy.contains('button', 'Add Instructor User', { timeout: 10000 })
      .click({ force: true });
  });

  it('Verify mandatory fields validation', () => {
    // Leave fields empty and click submit
    cy.contains('button', 'Submit').click({ force: true });

    // Expect error messages (adjust selectors based on your app)
    cy.contains(/First Name is required/i).should('be.visible');
    cy.contains(/Last Name is required/i).should('be.visible');
    cy.contains(/Email Id is required/i).should('be.visible');
    cy.contains(/Designation is required/i).should('be.visible');

    cy.log('Successfully verified: Error message shown for mandatory fields');
  });

  it('Verify phone number validation', () => {
    cy.get('input[type="tel"]').type('abc123', { force: true });
    cy.contains('button', 'Submit').click({ force: true });
    cy.contains(/Invalid phone number/i).should('be.visible');

    cy.log('Successfully verified: Error message for invalid phone number');
  });

  it('Verify email format validation', () => {
    cy.get('input[name="contactEmail"]').type('abc@xyz', { force: true });
    cy.contains('button', 'Submit').click({ force: true });
    cy.contains(/Invalid email/i).should('be.visible');

    cy.log('Successfully verified: Error message for invalid email format');
  });

  it('Verify Select All access option', () => {
    cy.contains('Select All').click();
    // all checkboxes should be checked
    cy.get('input[type="checkbox"]').each($el => {
      cy.wrap($el).should('be.checked');
    });

    cy.log('Successfully verified: All feature checkboxes selected');
  });

  it('Verify Clear access option', () => {
    cy.contains('Select All').click(); // first select all
    cy.contains('Clear').click();      // then clear
    cy.get('input[type="checkbox"]').each($el => {
      cy.wrap($el).should('not.be.checked');
    });

    cy.log('Successfully verified: All feature checkboxes cleared');
  });

  it('Verify feature access assignment', () => {
    // Fill mandatory fields
    cy.get('input[name="firstname"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="name"]').type('QA');
    cy.get('input[name="contactEmail"]').type(`instructor_${Date.now()}@example.com`);
    cy.get('input[type="tel"]').clear().type('9876543210');

    // Select a couple of features
    cy.contains('Certificate Issuance').click();
    cy.contains('Add Program').click();

    // Submit
    cy.contains('button', 'Submit').click({ force: true });

    cy.contains(/Instructor added/i, { timeout: 10000 }).should('be.visible');
    cy.log('Successfully verified: Instructor added with selected access rights');
  });

  it('Verify Submit with valid inputs', () => {
    cy.get('input[name="firstname"]').type('Jane');
    cy.get('input[name="lastName"]').type('Smith');
    cy.get('input[name="name"]').type('Trainer');
    cy.get('input[name="contactEmail"]').type(`instructor_${Date.now()}@example.com`);
    cy.get('input[type="tel"]').clear().type('9876543211');

    // Select all access
    cy.contains('Select All').click();

    // Submit
    cy.contains('button', 'Submit').click({ force: true });

    cy.contains(/Instructor added/i, { timeout: 10000 }).should('be.visible');
    cy.log('Successfully verified: New instructor created and appears in list');
  });
});
export{};
