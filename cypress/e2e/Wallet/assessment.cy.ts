/// <reference types="cypress" />

// Helper: start assessment flow
const startAssessment = () => {
  cy.visit('https://debug.aicareercoach.truscholar.io/');
  cy.wait(400);
  cy.contains('Start Assessment').scrollIntoView().click();

  cy.contains('h3', 'No, I want to work now').click();
  cy.contains('button', 'Continue').click();

  cy.contains('Engineering and Technical Skills').click();
  cy.contains('Art and Design').click();
  cy.contains('Social and Community Service').click();
  cy.contains('button', 'Continue to Assessment').click();
};

const answerAll = (pattern: 'A' | 'B' | 'RANDOM' | string[]) => {
  for (let i = 1; i <= 60; i++) {
    cy.contains('Which activity appeals to you more?', { timeout: 15000 }).should('be.visible');
    cy.get('.cursor-pointer').should('have.length.at.least', 2);

    cy.get('.cursor-pointer').then(options => {
      let index = 0;

      if (pattern === 'A') index = 0;
      else if (pattern === 'B') index = 1;
      else if (pattern === 'RANDOM') index = Math.floor(Math.random() * 2);
      else index = pattern[i - 1] === 'A' ? 0 : 1;

      cy.wrap(options[index]).scrollIntoView().click({ force: true });
    });

    if (i < 58) {
      cy.contains('button', 'Next Question').click({ force: true });
    } else {
      cy.contains('button', 'Complete Assessment').click({ force: true });
    }
  }
};

// ==================== TEST SUITE ====================
describe('TruScholar — AI Career Test', () => {

  // 1️⃣ Load test, UI checks
  it('should load the assessment and display correct UI elements', () => {
    cy.visit('https://debug.aicareercoach.truscholar.io/');

    cy.contains('Start Assessment').should('be.visible');
  });

  // 2️⃣ Validate forced-choice: only one option selectable
  it('should allow selecting only one option per question', () => {
    startAssessment();

    cy.contains('Which activity appeals to you more?', { timeout: 15000 }).should('be.visible');

    cy.get('.cursor-pointer').first().click();
    cy.wait(200);
    cy.get('.cursor-pointer').last().should('not.have.class', 'selected');
  });

  // 3️⃣ Prevent user from submitting without answering
  it('should block submission without selecting an answer', () => {
    startAssessment();

    cy.contains('button', 'Next Question').click({ force: true });

    cy.contains('Please select an option').should('be.visible');
  });

  // 4️⃣ Answer all questions randomly (your original test)
  it('should complete all 30 questions with RANDOM options', () => {
    startAssessment();
    answerAll('RANDOM');

    cy.contains('Career Assessment Report', { timeout: 20000 }).should('be.visible');
  });

  // 5️⃣ Always pick Option A → validate RIASEC result exists
  it('should complete assessment by selecting Option A for all questions', () => {
    startAssessment();
    answerAll('A');

    cy.contains('Career Assessment Report', { timeout: 20000 }).should('be.visible');
    cy.contains('Your Holland Code').should('exist');
  });

  // 6️⃣ Always pick Option B
  it('should complete assessment by selecting Option B for all questions', () => {
    startAssessment();
    answerAll('B');

    cy.contains('Career Assessment Report', { timeout: 20000 }).should('be.visible');
  });

  // 7️⃣ Mixed pattern test
  it('should handle a custom mixed A/B pattern', () => {
    const pattern = Array(60)
      .fill(null)
      .map((_, i) => (i % 2 === 0 ? 'A' : 'B'));

    startAssessment();
    answerAll(pattern);

    cy.contains('Career Assessment Report', { timeout: 20000 }).should('be.visible');
  });

  // 8️⃣ Validate last question shows Complete button
  it('should show Complete Assessment button on final question', () => {
    startAssessment();

    for (let i = 1; i <= 59; i++) {
      cy.get('.cursor-pointer').first().click();
      cy.contains('Next Question').click({ force: true });
    }

    cy.contains('Complete Assessment').should('be.visible');
  });

  // 9️⃣ Validate result page content
  it('should display RIASEC scores and Holland Code', () => {
    startAssessment();
    answerAll('RANDOM');

    cy.contains('Career Assessment Report').should('be.visible');
    cy.contains('Your Holland Code').should('be.visible');
    cy.get('.score-card').should('have.length.at.least', 3);
  });

  // 🔟 Refresh in the middle → ensure session resets
  it('should reset the test if page is refreshed', () => {
    startAssessment();

    cy.reload();

    cy.contains('Start Assessment').should('be.visible');
  });
});
export {}