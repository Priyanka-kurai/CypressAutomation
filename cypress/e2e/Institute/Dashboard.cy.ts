describe('Dashboard Cards Display', () => {
  before(() => {
    cy.visit('https://test.truscholar.io/');
    cy.contains('Log In as Organization').click();
    cy.get('#email').type('trupriyanka32k@gmail.com');
    cy.get('input[name=password]').type('TruscholarTest@123');
    cy.get('#signin').click();

    // Go to Dashboard
    cy.get('a#Dashboard').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });

  it('View all dashboard highlights', () => {
    const dashboardCards = [
      'Certificates Issued',
      'Badges Issued',
      'Marksheets Issued',
      'Program',
      'Courses',
      'Learners',
    ];

    // Just print each card label in Cypress runner/log
   dashboardCards.forEach(label => {
  it(`View ${label} card`, () => {
    cy.contains(new RegExp(label, 'i'), { timeout: 15000 })
      .invoke('text')
      .then((text) => {
        cy.log(`Found: ${text}`);
      });
  });
});
    cy.scrollTo('bottom', { duration: 2000 }); //
     it('Scroll to Learners Joined section', () => {
    cy.contains('h6', 'Learners Joined', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible');
    cy.log('Learners Joined section is visible');
  });

  it('Scroll to Resume Created by Learners section', () => {
    cy.contains('h6', 'Resume Created by Learners', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible');
    cy.log('Resume Created by Learners section is visible');
  });
   it('Scroll to No of Verification section', () => {
    cy.contains('h6', 'No of Verification', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible');
    cy.log('No of Verification section is visible');
  });

  it('Scroll to Wallet Access section', () => {
    cy.contains('h6', 'Wallet Access', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible');
    cy.log('Wallet Access section is visible');
  });

  it('Scroll to Access Report section', () => {
    cy.contains('h6', 'Access Report', { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible');
    cy.log('Access Report section is visible');
  });
});
});
  
export{};
