describe('TruScholar Wallet — AI Career Test navigation', () => {
  it('should log in and click on AI Career Test successfully', () => {

    //cy.viewport(1200, 700);
    cy.visit('https://debug.aicareercoach.truscholar.io/');

    cy.contains('Start Assessment')
  .scrollIntoView()
  .should('be.visible')
  .click();

 cy.wait(500)
  cy.contains('h3', 'No, I want to work now')
  .scrollIntoView()
  .click();

  cy.contains('button', 'Continue')
  .scrollIntoView()
  .click();
 cy.wait(500)
 cy.contains('Engineering and Technical Skills')
  .scrollIntoView()
  .click();
  cy.wait(500)
cy.contains('h3', 'Art and Design')
  .scrollIntoView()
  .click();
 cy.wait(500)
cy.contains('h3', 'Social and Community Service')
  .scrollIntoView()
  .click();
 cy.wait(500)
 cy.contains('button', 'Continue to Assessment')
  .scrollIntoView()
  .click();
  cy.wait(500)
cy.contains('p', 'Build and repair mechanical devices').click();
cy.contains('button', 'Next Question').click();

// CLICK FIRST OPTION (A or B)
cy.contains('p', 'Working with your hands on practical projects').click();

// WAIT FOR NEXT BUTTON TO BE ENABLED
cy.contains('button', 'Next Question')
   .click({ force: true });


  })
})
export {}