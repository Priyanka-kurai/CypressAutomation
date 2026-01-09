describe('Designer tool Tests', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);

    // Login before each test
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();

    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    
    cy.wait(1000); 
 cy.contains('a', 'Design Credentials')
  .should('be.visible')
  .click({ force: true });
    cy.wait(1500);
  });
  it('Should template list', () => {
cy.contains('Academic').should('be.visible');
cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardMedia-root')
  .trigger('mouseover', { force: true });

//cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root').click({ force: true });
cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiGrid-justify-xs-space-between > .MuiGrid-grid-xs-2 > .MuiButtonBase-root > .MuiButton-label').click({ force: true });
  })
})