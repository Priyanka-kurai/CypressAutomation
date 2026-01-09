describe('AI Career Test — Run 50 Times Automatically', () => {

  // Number of total executions
  const RUNS = 50;

  for (let run = 1; run <= RUNS; run++) {

    it(`Execution #${run} — Complete all 30 questions with random answers`, () => {

      cy.log(`========== RUN ${run} STARTED ==========`);

      cy.visit('https://debug.aicareercoach.truscholar.io/');

      cy.contains('Start Assessment').scrollIntoView().click();
      cy.contains('h3', 'No, I want to work now').click();
      cy.contains('button', 'Continue').click();

      cy.contains('Engineering and Technical Skills').click();
      cy.contains('h3', 'Art and Design').click();
      cy.contains('h3', 'Social and Community Service').click();

      cy.contains('button', 'Continue to Assessment').click();


      // ====== 30 QUESTIONS LOOP ======
      for (let q = 1; q <= 60; q++) {

        cy.log(`Answering Question ${q}`);

        // 1. Wait for question
        cy.contains('Which activity appeals to you more?', { timeout: 15000 })
          .should('be.visible');

        // 2. Ensure 2 clickable options
        cy.get('.cursor-pointer', { timeout: 10000 })
          .should('have.length', 2);

        // 3. Pick a random option (0 or 1)
        cy.get('.cursor-pointer').then(options => {
          const random = Math.floor(Math.random() * 2);
          cy.wrap(options[random])
            .scrollIntoView()
            .click({ force: true });
        });

        // 4. Navigation button
        if (q < 58) {
          cy.contains('button', 'Next Question', { timeout: 15000 })
            .scrollIntoView()
            .click({ force: true });
        } else {
          cy.contains('button', 'Complete Assessment', { timeout: 15000 })
            .scrollIntoView()
            .click({ force: true });
        }
      }

      // 5. Confirm results page loaded
      cy.contains('Career Assessment Report', { timeout: 20000 })
        .should('be.visible');

      cy.log(`========== RUN ${run} COMPLETED ==========`);

    });
  }
});
export {}