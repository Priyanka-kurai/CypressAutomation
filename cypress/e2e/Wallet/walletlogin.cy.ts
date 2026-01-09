describe('Wallet Login and Dashboard Flow', () => {
  beforeEach(() => {
    // Ignore app-level JS errors
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.visit('https://wallet.truscholar.io/');
  });


  it('Verify login  page open', () => {
    cy.contains('Welcome Back').should('be.visible');
    cy.get('#email').type('starishita9900@gmail.com');
    cy.get('input[name=password]').type('Sushil@23');
   cy.contains('button', 'Sign In').click()

    cy.url().should('include', '/dashboard'); // Redirected to dashboard
  });

  it('Verify login with invalid credentials', () => {
   // cy.contains('Log In as Organization').click();
    cy.get('#email').type('wrong@test.com');
    cy.get('input[name=password]').type('WrongPass');
  cy.contains('button', 'Sign In').click()

    cy.contains('Incorrect username or password').should('be.visible');
  });

  it('Verify mandatory fields validation', () => {
    //cy.contains('Log In as Organization').click();
    cy.contains('button', 'Sign In').click()

    cy.contains('Invalid email format').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('Verify Forgot Password link', () => {
   // cy.contains('Log In as Organization').click();
    cy.contains('Forgot password?').click();
    cy.url().should('include', '/forgot');
  });

  context('After successful login', () => {
    beforeEach(() => {
     // cy.contains('Log In as Organization').click();
      cy.get('#email').type('trupriyanka32k@gmail.com');
      cy.get('input[name=password]').type('TruscholarTest@123');
    cy.contains('button', 'Sign In').click()

        cy.get('#Dashboard', { timeout: 20000 }).should('be.visible');
        //cy.wait("3000")
    });
})
})