/// <reference types="cypress" />

describe("RIASEC Career Assessment - Full Automation Suite", () => {

  // ========================================
  // COMMON FUNCTION: Start Assessment
  // ========================================
  function startAssessment() {
    cy.visit("https://debug.aicareercoach.truscholar.io/");

    cy.contains("Start Assessment").scrollIntoView().click();
    cy.contains("No, I want to work now").click();
    cy.contains("Continue").click();

    cy.wait(500);
    cy.contains("Engineering and Technical Skills").click();
    cy.wait(500);
    cy.contains("Art and Design").click();
    cy.wait(500);
    cy.contains("Social and Community Service").click();
    cy.wait(500);
    cy.contains("button", "Continue to Assessment").click();
  }

  // ========================================
  // COMMON FUNCTION: Answer All Questions
  // callback = function(i): returns 0 or 1 (A or B)
  // ========================================
  function answerAll(callback) {

    for (let i = 1; i <= 30; i++) {
      cy.log(`--- Answering Question ${i} ---`);

      cy.get(".text-lg.leading-relaxed", { timeout: 8000 })
        .should("have.length", 2)
        .as("options");

      cy.get("@options").eq(0).invoke("text").as("oldOptionA");

      cy.get(".cursor-pointer")
        .should("have.length", 2)
        .eq(callback(i))
        .scrollIntoView()
        .click({ force: true });

      if (i < 30) {
        cy.contains("Next Question", { timeout: 8000 })
          .click({ force: true });

        cy.get("@oldOptionA").then((oldA) => {
          cy.get(".text-lg.leading-relaxed", { timeout: 8000 })
            .eq(0)
            .should("not.have.text", oldA);
        });

      } else {
        cy.contains("Complete Assessment", { timeout: 8000 })
          .click({ force: true });
      }
    }
  }

  // ========================================
  // COMMON FUNCTION: Validate Report Loaded
  // ========================================
  function verifyReport() {
    cy.contains("Career Assessment Report", { timeout: 10000 });
  }

  // ========================================
  // TEST CASE 1 — RANDOM ATTEMPT
  // ========================================
  it("TC-01: Complete Assessment with Random Answers", () => {
    startAssessment();

    answerAll(() => Cypress._.random(0, 1));

    verifyReport();
  });

  // ========================================
  // TEST CASE 2 — ALL A
  // ========================================
  it("TC-02: All A Answers (Forced Choice)", () => {
    startAssessment();

    answerAll(() => 0); // Always choose first option (A)

    verifyReport();
  });

  // ========================================
  // TEST CASE 3 — ALL B
  // ========================================
  it("TC-03: All B Answers", () => {
    startAssessment();

    answerAll(() => 1); // Always choose second option (B)

    verifyReport();
  });

  // ========================================
  // TEST CASE 4 — MAXIMIZE R (example mapping)
  // You can update this once you finalize mappings
  // ========================================
  const Rset = new Set([1, 2, 5, 7, 10, 14, 17, 19, 22, 28]); 

  it("TC-04: Maximize R Answers", () => {
    startAssessment();

    answerAll(i => Rset.has(i) ? 0 : 1);

    verifyReport();
  });

  // ========================================
  // TEST CASE 5 — MAXIMIZE I (example mapping)
  // ========================================
  const Iset = new Set([3, 6, 8, 9, 12, 15, 18, 21, 23, 27]);

  it("TC-05: Maximize I Answers", () => {
    startAssessment();

    answerAll(i => Iset.has(i) ? 0 : 1);

    verifyReport();
  });

  // ========================================
  // TEST CASE 6 — BALANCED USER (Alternate A/B)
  // ========================================
  it("TC-06: Balanced User (A/B Alternate)", () => {
    startAssessment();

    answerAll(i => i % 2 === 0 ? 0 : 1);

    verifyReport();
  });

  // ========================================
  // TEST CASE 7 — FAST VALIDATION (Click A for 15, B for 15)
  // ========================================
  it("TC-07: Half A Half B", () => {
    startAssessment();

    answerAll(i => i <= 15 ? 0 : 1);

    verifyReport();
  });

});
export {}