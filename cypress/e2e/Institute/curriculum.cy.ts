describe('Curriculum Management Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();
  });

  it('Click on Academic menu', () => {
    cy.contains('span', 'Academic', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

    // Verify navigation or expansion
    //cy.url().should('include', '/users'); // adjust if different
  });

  it('Verify Curriculum list is displayed', () => {
    // Navigate to Curriculum after Academic
    cy.contains('span', 'Academic', { timeout: 10000 }).click({ force: true });
    cy.contains('span', 'Curriculum', { timeout: 10000 }).click({ force: true });

  
    cy.contains('Curriculum', { timeout: 20000 }).should('be.visible');
    cy.contains('Program Code').should('be.visible');

    //cy.log('Successfully verified: Curriculum list is displayed');
//it('Click on Add Program button', () => {
  cy.contains('button', 'Add Program', { timeout: 20000 })
    .should('be.visible')
    .click({ force: true });





  });
});
export{};