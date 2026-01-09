describe("AI Career Test — 30 Ordered RIASEC Patterns", () => {

  const questionBank = [
    { option1: "R", option2: "I" }, // 1
    { option1: "R", option2: "A" }, // 2
    { option1: "S", option2: "E" }, // 3
    { option1: "C", option2: "I" }, // 4
    { option1: "A", option2: "S" }, // 5
    { option1: "E", option2: "C" }, // 6
    { option1: "R", option2: "A" }, // 7
    { option1: "I", option2: "S" }, // 8
    { option1: "E", option2: "R" }, // 9
    { option1: "C", option2: "A" }, // 10
    { option1: "R", option2: "I" }, // 11
    { option1: "A", option2: "S" }, // 12
    { option1: "E", option2: "C" }, // 13
    { option1: "R", option2: "I" }, // 14
    { option1: "A", option2: "S" }, // 15
    { option1: "E", option2: "C" }, // 16
    { option1: "R", option2: "I" }, // 17
    { option1: "A", option2: "S" }, // 18
    { option1: "E", option2: "C" }, // 19
    { option1: "R", option2: "I" }, // 20
    { option1: "A", option2: "S" }, // 21
    { option1: "E", option2: "C" }, // 22
    { option1: "R", option2: "I" }, // 23
    { option1: "A", option2: "S" }, // 24
    { option1: "E", option2: "C" }, // 25
    { option1: "R", option2: "I" }, // 26
    { option1: "A", option2: "S" }, // 27
    { option1: "E", option2: "C" }, // 28
    { option1: "R", option2: "I" }, // 29
    { option1: "A", option2: "S" }  // 30
  ];

  function startAssessment() {
    cy.visit("https://debug.aicareercoach.truscholar.io/");
    cy.contains("Start Assessment").scrollIntoView().click();
    cy.contains("h3", "No, I want to work now").click();
    cy.contains("button", "Continue").click();
    cy.wait(500);
    cy.contains('Engineering and Technical Skills').click();
     cy.wait(500);
    cy.contains('h3', 'Art and Design').click();
     cy.wait(500);
    cy.contains('h3', 'Social and Community Service').click();
     cy.wait(500);
    cy.contains('button', 'Continue to Assessment').click();
  }

  const answerAllQuestions = (chooseFn) => {
    for (let i = 1; i <= 30; i++) {

      cy.wait(1500);

      cy.contains("Which activity appeals to you more?", { timeout: 60000 })
        .should("be.visible");

      cy.get(".cursor-pointer", { timeout: 20000 }).then(options => {
        const index = chooseFn(i);
        cy.wrap(options[index]).scrollIntoView().click({ force: true });
      });

      cy.wait(1500);

       if (i < 30) {
        cy.contains('button', 'Next Question')
        .click({ force: true });
      } else {
        cy.contains('button', 'Complete Assessment')
          .click({ force: true });
      }
      cy.wait(1500);
    }
  };

  const waitForReport = () => {
    cy.contains("Career Assessment Report", { timeout: 60000 }).should("be.visible");
    cy.wait(2000);
  };

  function createChooseFn(pair) {
    const first = pair[0];
    const second = pair[1];

    return (qNo) => {
      const target = qNo <= 15 ? first : second;
      const row = questionBank[qNo - 1];

      if (row.option1 === target) return 0;
      if (row.option2 === target) return 1;

      return 0;
    };
  }

  // ----------------------------------------------------------
  // 30 EXPLICIT TEST CASES (auto-generated)
  // ----------------------------------------------------------

  it("TC01 - Ordered Pair: RI", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("RI"));
    waitForReport();
  });

  it("TC02 - Ordered Pair: RA", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("RA"));
    waitForReport();
  });

  it("TC03 - Ordered Pair: RS", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("RS"));
    waitForReport();
  });

  it("TC04 - Ordered Pair: RE", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("RE"));
    waitForReport();
  });

  it("TC05 - Ordered Pair: RC", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("RC"));
    waitForReport();
  });

  it("TC06 - Ordered Pair: IR", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("IR"));
    waitForReport();
  });

  it("TC07 - Ordered Pair: IA", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("IA"));
    waitForReport();
  });

  it("TC08 - Ordered Pair: IS", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("IS"));
    waitForReport();
  });

  it("TC09 - Ordered Pair: IE", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("IE"));
    waitForReport();
  });

  it("TC10 - Ordered Pair: IC", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("IC"));
    waitForReport();
  });

  it("TC11 - Ordered Pair: AR", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("AR"));
    waitForReport();
  });

  it("TC12 - Ordered Pair: AI", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("AI"));
    waitForReport();
  });

  it("TC13 - Ordered Pair: AS", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("AS"));
    waitForReport();
  });

  it("TC14 - Ordered Pair: AE", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("AE"));
    waitForReport();
  });

  it("TC15 - Ordered Pair: AC", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("AC"));
    waitForReport();
  });

  it("TC16 - Ordered Pair: SR", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("SR"));
    waitForReport();
  });

  it("TC17 - Ordered Pair: SI", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("SI"));
    waitForReport();
  });

  it("TC18 - Ordered Pair: SA", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("SA"));
    waitForReport();
  });

  it("TC19 - Ordered Pair: SE", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("SE"));
    waitForReport();
  });

  it("TC20 - Ordered Pair: SC", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("SC"));
    waitForReport();
  });

  it("TC21 - Ordered Pair: ER", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("ER"));
    waitForReport();
  });

  it("TC22 - Ordered Pair: EI", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("EI"));
    waitForReport();
  });

  it("TC23 - Ordered Pair: EA", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("EA"));
    waitForReport();
  });

  it("TC24 - Ordered Pair: ES", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("ES"));
    waitForReport();
  });

  it("TC25 - Ordered Pair: EC", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("EC"));
    waitForReport();
  });

  it("TC26 - Ordered Pair: CR", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("CR"));
    waitForReport();
  });

  it("TC27 - Ordered Pair: CI", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("CI"));
    waitForReport();
  });

  it("TC28 - Ordered Pair: CA", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("CA"));
    waitForReport();
  });

  it("TC29 - Ordered Pair: CS", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("CS"));
    waitForReport();
  });

  it("TC30 - Ordered Pair: CE", () => {
    startAssessment();
    answerAllQuestions(createChooseFn("CE"));
    waitForReport();
  });

});
