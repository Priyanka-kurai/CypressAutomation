describe('TruScholar Wallet — AI Career Test All Scenarios', () => {

  // ==================== COMMON FUNCTION ====================
  function startAssessment() {
    cy.visit('https://debug.aicareercoach.truscholar.io/');
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
  }

  // Mapping for each question → which index to pick
  // 0 = A, 1 = B

  const majorityMap = {
    "R": [0,0, null,null,null,null,0,null,1,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null],
    "I": [1,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null],
    "A": [null,1,null,null,0,null,1,null,null,0,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null,null,0],
    "S": [null,null,0,null,1,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1],
    "E": [null,null,1,null,null,0,null,null,0,null,null,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null,null,0,null,null],
    "C": [null,null,null,1,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null,null,1,null]
  };

  function answerAllQuestions(answerPattern) {
    for (let q = 1; q <= 30; q++) {

      cy.contains('Which activity appeals to you more?', { timeout: 15000 })
        .should('be.visible');

      const optionIndex = answerPattern[q - 1];

      // If null → choose randomly
      if (optionIndex === null) {
        cy.get('.cursor-pointer').then(options => {
          const randomIndex = Math.floor(Math.random() * 2);
          cy.wrap(options[randomIndex]).click({ force: true });
        });
      } else {
        cy.get('.cursor-pointer').eq(optionIndex).click({ force: true });
      }

      cy.wait(200);

      if (q < 29) {
        cy.contains('button', 'Next Question').click({ force: true });
      } else {
        cy.contains('button', 'Complete Assessment').click({ force: true });
      }
    }

    cy.contains('Career Assessment Report', { timeout: 20000 })
      .should('be.visible');

    cy.wait(5000); // allow user to view result
  }

  // =============================================================
  // 1️⃣ Test Case: All A
  // =============================================================
  it('TC01 - All A Options', () => {
    startAssessment();
    answerAllQuestions(Array(30).fill(0));
  });

  // =============================================================
  // 2️⃣ Test Case: All B
  // =============================================================
  it('TC02 - All B Options', () => {
    startAssessment();
    answerAllQuestions(Array(30).fill(1));
  });

  // =============================================================
  // 3️⃣ Majority R
  // =============================================================
  it('TC03 - Majority R', () => {
    startAssessment();
    answerAllQuestions(majorityMap["R"]);
  });

  // =============================================================
  // 4️⃣ Majority I
  // =============================================================
  it('TC04 - Majority I', () => {
    startAssessment();
    answerAllQuestions(majorityMap["I"]);
  });

  // =============================================================
  // 5️⃣ Majority A
  // =============================================================
  it('TC05 - Majority A', () => {
    startAssessment();
    answerAllQuestions(majorityMap["A"]);
  });

  // =============================================================
  // 6️⃣ Majority S
  // =============================================================
  it('TC06 - Majority S', () => {
    startAssessment();
    answerAllQuestions(majorityMap["S"]);
  });

  // =============================================================
  // 7️⃣ Majority E
  // =============================================================
  it('TC07 - Majority E', () => {
    startAssessment();
    answerAllQuestions(majorityMap["E"]);
  });

  // =============================================================
  // 8️⃣ Majority C
  // =============================================================
  it('TC08 - Majority C', () => {
    startAssessment();
    answerAllQuestions(majorityMap["C"]);
  });

  // =============================================================
  // 9️⃣ Balanced 15 – 15
  // =============================================================
  it('TC09 - Balanced A/B (15-15)', () => {
    startAssessment();
    const pattern = [
      ...Array(30).fill(0),
      ...Array(30).fill(1)
    ];
    answerAllQuestions(pattern);
  });

  // =============================================================
  // 🔟 Random Test
  // =============================================================
  it('TC10 - Random Mixed Options', () => {
    startAssessment();
    const pattern = Array(60).fill(null); // null = random pick
    answerAllQuestions(pattern);
  });

});
