describe('TruScholar Wallet — AI Career Test navigation', () => {
  it('should complete all 30 questions with random options', () => {

    cy.visit('https://riasec-app-592805402248.asia-southeast1.run.app');
 cy.wait(500);
    cy.contains('Start Assessment').scrollIntoView().click();
    cy.wait(500);

    cy.contains('h3', 'No, I want to work now').click();
    cy.contains('button', 'Continue').click();

    cy.wait(500);
    cy.contains('Engineering and Technical Skills').click();
     cy.wait(500);
    cy.contains('h3', 'Art and Design').click();
     cy.wait(500);
    cy.contains('h3', 'Social and Community Service').click();
     cy.wait(500);
    cy.contains('button', 'Continue to Assessment').click();

    // ================= LOOP FOR ALL 30 QUESTIONS =================
    for (let i = 1; i <= 30; i++) {
      cy.wait(1500);

      // cy.log(`Answering Question ===>>> ${i}`);
      cy.then(() => {
  console.log(`Answering Question before ===>>> ${i}`);
});


      // 1. Wait for question to load
      cy.contains('Which activity appeals to you more?', { timeout: 1500 })
        .should('be.visible');

      // 2. Ensure options exist (A & B)
      // cy.get('.cursor-pointer')
      //   .should('have.length.at.least', 2);

      // 3. RANDOM selection between 0 (A) or 1 (B)
      cy.get('.cursor-pointer').then(options => {
        const randomIndex = Math.floor(Math.random() * 2); // 0 or 1
        cy.then(() => {
  console.log(`randomIndex ===>>> ${randomIndex} - ${options[0]} - ${options[1]}`);
});
        cy.wrap(options[randomIndex])
        .scrollIntoView()
        .click({ force: true });
      });

      cy.wait(1500);
      
      
      // 4. Click correct button depending on question number
      if (i < 30) {
        cy.contains('button', 'Next Question')
        .click({ force: true });
      } else {
        cy.contains('button', 'Complete Assessment')
          .click({ force: true });
      }

      cy.wait(1500); // let UI update
      // cy.wait(300);
      cy.then(() => {
        console.log(`Answering Question after ===>>> ${i}`);
      });
}

    // 5. Verify results page
    // cy.contains('Career Assessment Report', { timeout: 20000 })
    //   .should('be.visible');

  });
});
export {}
