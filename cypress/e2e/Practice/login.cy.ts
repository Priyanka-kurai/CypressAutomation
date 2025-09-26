describe('Instructor List Display', () => {
  it('Login and verify Instructor list is visible', () => {
    // Login
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Navigate to Instructors page
    cy.get('a#Instructors', { timeout: 10000 }).click();
    cy.url().should('include', '/instructoruser/list');

    // Verify Instructor list table/grid
    cy.contains('Name', { timeout: 15000 }).should('be.visible');
    cy.contains('Designation').should('be.visible');
    cy.contains('Status').should('be.visible');

    cy.log('✅ Successfully verified: Instructor list is displayed');
  });
});

export {};

