// cypress/e2e/homepage.cy.js

describe('HomePage', () => {

  it('should display Welcome on homepage', () => {
    cy.visitLoginPage();
    cy.get("h3").contains("Welcome");
  });

  it('should login and navigate to credentials', () => {
    cy.visitLoginPage();
    cy.login('starishita9900@gmail.com', 'Sushil@23');
    cy.closeAnnouncements();
    cy.openMyCredentials();
    cy.copyVerificationLink();
    cy.downloadCredential();
  });

});
