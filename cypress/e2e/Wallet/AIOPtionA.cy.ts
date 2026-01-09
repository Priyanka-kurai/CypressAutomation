describe('TruScholar Wallet — AI Career Test navigation', () => {
  it('should complete all 30 questions successfully', () => {

    cy.visit('https://debug.aicareercoach.truscholar.io/');

    cy.contains('Start Assessment').scrollIntoView().click();
    cy.wait(500);

    cy.contains('h3', 'No, I want to work now').click();
    cy.contains('button', 'Continue').click();

    cy.wait(500);
    cy.contains('Engineering and Technical Skills').click();
    cy.contains('h3', 'Art and Design').click();
    cy.contains('h3', 'Social and Community Service').click();
    cy.contains('button', 'Continue to Assessment').click();

    // =============== LOOP FOR ALL 30 QUESTIONS ===============
    for (let i = 1; i <= 60; i++) {

      cy.log(`Answering Question ${i}`);

      // 1. Wait for question header
      cy.contains('Which activity appeals to you more?', { timeout: 15000 })
        .should('be.visible');

      // 2. Ensure options exist
      cy.get('.cursor-pointer', { timeout: 10000 })
        .should('have.length.at.least', 1);

      // 3. Select option A
      cy.get('.cursor-pointer')
        .first()
        .scrollIntoView()
        .click({ force: true });

      cy.wait(200); // allow React to enable button

      // 4. Button handling
      if (i < 58) {
        // Next Question for Q1–29
        cy.contains('button', 'Next Question', { timeout: 15000 })
          //.should('not.be.disabled')
          .click({ force: true });

      } else {
        // Final button for Q30
        cy.contains('button', 'Complete Assessment', { timeout: 15000 })
          //.should('not.be.disabled')
          .click({ force: true });
      }

      cy.wait(300); // UI transition
    }

    // Verify we reached results page
   cy.contains('Career Assessment Report', { timeout: 20000 }).should('be.visible');

  });
});
export {}