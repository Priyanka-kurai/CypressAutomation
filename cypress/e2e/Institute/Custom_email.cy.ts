describe('Cust Tests', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    //cy.contains('a', 'Custom Email').click();

    cy.wait(1000); 
 cy.contains('a', 'Custom Email')
  .should('be.visible')
  .click({ force: true });
    cy.wait(1500);
  });
it('Should display Custom email page', () => {
cy.url().should('include', '/email'); // Verify correct page URL   
cy.contains('button', 'View').click();

})
it('Should editemail template details', () => {
    cy.contains('button', 'View').click();
 // if modal opens

})
})