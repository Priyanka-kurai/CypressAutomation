describe('HomePage', () => {
  beforeEach(() => {
    // Ignore app-level errors like 404 or external API failures
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
  });

  it('open url and homepage contains welcome', () => {
    cy.visit('https://test.truscholar.io/');
    // cy.get("h1").contains("Sign In");
  });

  describe('Login Flow', () => {
    it('should log in with valid credentials', () => {
      cy.visit('https://test.truscholar.io/');
      cy.viewport(1000, 660);

      // ✅ Click "Log In as Organization" card
      cy.get(':nth-child(1) > div > [style="font-size: 16px; color: rgb(51, 51, 51); font-weight: 600;"]').click();

      // ✅ Perform login
      cy.get('#email', { timeout: 10000 }).type('trupriyanka32k@gmail.com');
      cy.get('input[name=password]').type('TruscholarTest@123');
      //cy.contains('Sign In').click({force:true});
      cy.wait(2000);
      cy.get('#signin > .MuiButton-label').click();

      cy.wait(3000);
    });
  });
});
export {};