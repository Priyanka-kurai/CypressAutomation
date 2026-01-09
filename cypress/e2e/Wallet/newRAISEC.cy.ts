describe('TruScholar Wallet — AI Career Test navigation', () => {
  it('should complete all 30 questions with random options', () => {

    cy.visit('https://riasec-responses-test-878524709646.asia-southeast1.run.app');
 cy.wait(500);
cy.get('input[name="name"]')
  .clear()            // optional – clears existing text
  .type('Priyanka');  // enters Priyanka
cy.wait(500);
cy.get('input[name="occupation"]')
  .clear()
  .type('QA Engineer');
cy.wait(500);
cy.get('input[name="education"]')
  .clear()
  .type('B.E');
cy.get('button.start-btn').click();


// Wait for loader text to disappear
cy.contains('Loading next question', { timeout: 20000 })
  .should('not.exist');

// Now click option A
cy.contains('.option-card', 'A', { timeout: 20000 })
  .should('be.visible')
  .click();




})
})
export {}