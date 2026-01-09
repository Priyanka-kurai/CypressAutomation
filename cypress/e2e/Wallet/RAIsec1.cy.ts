// cypress/e2e/Wallet/RAIsec_stubs.cy.ts
describe('RAIsec - complete 30 questions (stubbed)', () => {
  beforeEach(() => {
    // make sure these intercepts are active BEFORE visiting the page
    cy.intercept('GET', '/get_live_scores', {
      statusCode: 200,
      body: { scores: [] },
    }).as('getLiveScores');

    cy.intercept('POST', '/save_answer', (req) => {
      // emulate backend saving and return success quickly
      req.reply({ statusCode: 200, body: { ok: true } });
    }).as('saveAnswer');
  });

  it('should finish 30 Qs by selecting random options', () => {
    cy.visit('https://riasec-responses-test-878524709646.asia-southeast1.run.app/'); // or full url
    //cy.url().should('include', '/basic_info');

    cy.get('input[name="name"]').clear().type('Priyanka');
    cy.get('input[name="occupation"]').clear().type('QA Engineer');
    cy.get('input[name="education"]').clear().type('B.E');
    cy.get('button.start-btn').click();

    cy.url({ timeout: 10000 }).should('include', '/assessment');

    // wait for initial live-scores fetch (stubbed)
    //cy.wait('@getLiveScores');

    for (let i = 0; i < 30; i++) {
      // capture current question text (trim whitespace)
      cy.get('.question-text', { timeout: 10000 }).invoke('text').then(prevQ => {
        const prev = prevQ.trim();

        // pick a random visible option and click
        cy.get('.option-card:visible').then($cards => {
          const idx = Math.floor(Math.random() * $cards.length);
          cy.wrap($cards[idx]).click();
        });

        // wait for save_answer to be called and for next live scores
        cy.wait('@saveAnswer', { timeout: 10000 });
        //cy.wait('@getLiveScores', { timeout: 10000 });

        // now wait for question text to change (or at least become different)
        cy.get('.question-text', { timeout: 10000 }).should($el => {
          const t = $el.text().trim();
          if (t === prev) {
            throw new Error('question text still same — something is wrong');
          }
        });
      });
    }

    // final results check (adjust selector to your app)
    cy.get('.final-results', { timeout: 20000 }).should('exist');
  });
});
