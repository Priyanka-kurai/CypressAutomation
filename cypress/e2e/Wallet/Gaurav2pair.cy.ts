// ==========================
// RIASEC 2-CODE TEST MATRIX
// ==========================

const PAIRS = [
  ['R', 'I'],
  ['R', 'A'],
  ['R', 'S'],
  ['R', 'E'],
  ['R', 'C'],
  ['I', 'A'],
  ['I', 'S'],
  ['I', 'E'],
  ['I', 'C'],
  ['A', 'S'],
  ['A', 'E'],
  ['A', 'C'],
  ['S', 'E'],
  ['S', 'C'],
  ['E', 'C']
];

describe("RIASEC Two-Code Pair Execution Matrix", () => {

  PAIRS.forEach((pair) => {

    const [X, Y] = pair;
    const testName = `Executing Pair: ${X} – ${Y}`;

    it(testName, () => {

      cy.log(`========== RUNNING PAIR: ${X} – ${Y} ==========`);

      // 1️⃣ Start app
      cy.visit("https://job-recommendation-878524709646.asia-southeast1.run.app/");
      cy.contains("Get Started").click();

      // 2️⃣ Fill user details fast
      cy.get('input[name="name"]').type(`TestUser_${X}${Y}`);
      
      const email = `pair_${X}${Y}_${Date.now()}@gmail.com`;
      cy.get('input[name="email"]').type(email);
      
      cy.get('#education_level').select("Bachelor's Degree");
      cy.get('#experience_years').type('2');
      cy.get('#current_field').type('AutomationQA');

      cy.contains("Continue to Interests").click();

      // 3️⃣ Select ANY interests
      cy.get('#interest1').check();
      cy.get('#interest5').check();
      cy.get('#interest8').check();

      cy.contains("Continue to RIASEC Assessment").click();

      cy.intercept("GET", "/api/riasec/current-scores").as("scores");

      // 4️⃣ Main answering loop — using ONLY the two selected codes X & Y
      function answer(i = 1) {

        cy.log(`--- QUESTION ${i} / 30 for Pair ${X}-${Y} ---`);

        cy.get("#optionsContainer .option-card").then($opts => {

          let chosen = null;
          cy.wait(500)
          // Read A option
          const A_text = $opts[0].innerText.trim();
          const B_text = $opts[1].innerText.trim();

          // Determine which option matches X/Y
          if (A_text.includes(X) || A_text.includes(Y)) {
            chosen = 0;
          } else {
            chosen = 1;
          }

          cy.log(`Selecting Option ${chosen === 0 ? "A" : "B"} for ${X}-${Y}`);
          cy.wait(1000)
          cy.wrap($opts[chosen])
            .find('input[type="radio"]')
            .check({ force: true });
        });

       // cy.wait("@scores").catch(() => {});

        // Next or Submit
        if (i < 30) {
          cy.get('#nextButton').click({ force: true });
          answer(i + 1);
        } else {
          cy.contains(/Submit|Complete/i).click({ force: true });
        }
      }

      answer(1);

      // 5️⃣ Log output results
      cy.wait(2000);
      cy.get("body").then($body => {
        cy.log("=== FINAL RESULT FOR PAIR ===");
        cy.log(`Pair: ${X}-${Y}`);
        cy.log("Page Result Content:");
        cy.log($body.text());
      });

    });
  });
});
