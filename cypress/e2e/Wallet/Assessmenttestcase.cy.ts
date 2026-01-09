describe("TruScholar Wallet — AI Career Test (FINAL MAPPED SUITE)", () => {

  // ==========================================
  // QUESTION → OPTION → RIASEC CODE MAPPING
  // ==========================================
  const QUESTION_MAP = [
    null, // index 0 unused
    { A: "R", B: "I" },
    { A: "R", B: "A" },
    { A: "S", B: "E" },
    { A: "C", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "A" },
    { A: "I", B: "S" },
    { A: "E", B: "R" },
    { A: "C", B: "A" },
    { A: "R", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "I" },
    { A: "A", B: "S" },
    { A: "E", B: "C" },
    { A: "R", B: "I" },
    { A: "A", B: "S" }
  ];


  // ==========================================
  // HELPERS
  // ==========================================
  const startAssessment = () => {

    cy.visit('https://debug.aicareercoach.truscholar.io/');

    cy.contains('Start Assessment', { timeout: 20000 })
      .scrollIntoView()
      .click();

    cy.contains('h3', 'No, I want to work now', { timeout: 20000 }).click();
    cy.contains('button', 'Continue').click();

    // Select any 3 categories
    cy.contains('Engineering and Technical Skills').click();
    cy.contains('Art and Design').click();
    cy.contains('Social and Community Service').click();

    cy.contains('button', 'Continue to Assessment', { timeout: 20000 }).click();

    cy.wait(2000);
  };


  const answerAllQuestions = (chooseFn) => {
    for (let i = 1; i <= 30; i++) {

      cy.wait(1500);

      cy.contains("Which activity appeals to you more?", { timeout: 60000 })
        .should("be.visible");

      cy.get(".cursor-pointer", { timeout: 20000 }).then(options => {
        const index = chooseFn(i); // 0 or 1

        cy.wrap(options[index])
          .scrollIntoView()
          .click({ force: true });
      });

      cy.wait(1500);

      if (i < 30) {
        cy.contains("Next Question", { timeout: 60000 })
          .scrollIntoView()
          .click({ force: true });
      } else {
        cy.contains("Complete Assessment", { timeout: 60000 })
          .scrollIntoView()
          .click({ force: true });
      }

      cy.wait(1500);
    }
  };


  const waitForReport = () => {
    cy.contains("Career Assessment Report", { timeout: 60000 })
      .should("be.visible");

    cy.wait(2000);
  };



  // ============================================================
  // 🔵 UTILITY – BUILD MAJORITY SELECTION SET BASED ON RIASEC CODE
  // ============================================================
  const buildMajoritySet = (targetCode) => {
    const set = new Set();

    for (let q = 1; q <= 30; q++) {
      if (QUESTION_MAP[q].A === targetCode) set.add(q); // pick option A
    }

    return set;
  };



  // ============================================================
  // TEST CASES
  // ============================================================

  // TC01: All A
  it("TC01 - All A", () => {
    startAssessment();
    answerAllQuestions(() => 0);
    waitForReport();
  });

  // TC02: All B
  it("TC02 - All B", () => {
    startAssessment();
    answerAllQuestions(() => 1);
    waitForReport();
  });


  // TC03: Majority R (using question mapping)
  it("TC03 - Majority R", () => {
    startAssessment();

    const Rset = buildMajoritySet("R");

    answerAllQuestions(i => (Rset.has(i) ? 0 : 1));

    waitForReport();
  });


  // TC04: Majority I
  it("TC04 - Majority I", () => {
    startAssessment();

    const Iset = buildMajoritySet("I");

    answerAllQuestions(i => (Iset.has(i) ? 0 : 1));

    waitForReport();
  });


  // TC05: Majority A
  it("TC05 - Majority A", () => {
    startAssessment();

    const Aset = buildMajoritySet("A");

    answerAllQuestions(i => (Aset.has(i) ? 0 : 1));

    waitForReport();
  });


  // TC06: Majority S
  it("TC06 - Majority S", () => {
    startAssessment();

    const Sset = buildMajoritySet("S");

    answerAllQuestions(i => (Sset.has(i) ? 0 : 1));

    waitForReport();
  });


  // TC07: Majority E
  it("TC07 - Majority E", () => {
    startAssessment();

    const Eset = buildMajoritySet("E");

    answerAllQuestions(i => (Eset.has(i) ? 0 : 1));

    waitForReport();
  });


  // TC08: Majority C
  it("TC08 - Majority C", () => {
    startAssessment();
  // MANUAL FIX — Identify questions where C appears
  const Cset = new Set([
    // C appears as A
    10,

    // C appears as B
    6, 13, 16, 19, 22, 25, 28
  ]);
   // const Cset = buildMajoritySet("C");

    answerAllQuestions(i => (Cset.has(i) ? 0 : 1));
//answerAllQuestions(i => (Cset.has(i) ? 0 : 1));

    waitForReport();
  });


  // TC09: Balanced 15 A + 15 B
  it("TC09 - Balanced A/B", () => {
    startAssessment();

    answerAllQuestions(i => (i <= 15 ? 0 : 1));

    waitForReport();
  });


  // TC10: Completely Random
  it("TC10 - Random", () => {
    startAssessment();

    answerAllQuestions(() => (Math.random() < 0.5 ? 0 : 1));

    waitForReport();
  });

});
