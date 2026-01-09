const recommendedAnswers = [
  "A","A","B","A","A",
  "A","A","A","B","B",
  "A","B","A","A","B",
  "A","A","A","A","A",
  "A","A","A","A","A",
  "A","A","A","A","A"
];

describe('AI Career Test - Strong Recommended Answers', () => {
  it('should complete all 30 questions with recommended options', () => {

    cy.visit('https://debug.aicareercoach.truscholar.io/');
    cy.wait(500);

    cy.contains('Start Assessment').scrollIntoView().click();
    cy.wait(500);

    cy.contains('h3', 'No, I want to work now').click();
    cy.contains('button', 'Continue').click();

    cy.contains('Engineering and Technical Skills').click();
    cy.wait(200);
    cy.contains('h3', 'Art and Design').click();
    cy.wait(200);
    cy.contains('h3', 'Social and Community Service').click();
    cy.wait(200);
    cy.contains('button', 'Continue to Assessment').click();

    // ----------- 30 QUESTIONS LOOP -----------
    recommendedAnswers.forEach((ans, i) => {
      cy.log(`Answering Question ${i + 1}`);

      cy.contains('Which activity appeals to you more?', { timeout: 15000 })
        .should('be.visible');

      cy.get('.cursor-pointer', { timeout: 10000 })
        .should('have.length', 2);

      if (ans === "A") {
        cy.get('.cursor-pointer').first().click({ force: true });
      } else {
        cy.get('.cursor-pointer').eq(1).click({ force: true });
      }

      cy.wait(200);

      if (i < 60) {
        cy.contains('button', 'Next Question').click({ force: true });
      } else {
        cy.contains('button', 'Complete Assessment').click({ force: true });
      }

      cy.wait(300);
    });

   // cy.contains('Career Assessment Report', { timeout: 20000 })
     // .should('be.visible');
  });
  
});
