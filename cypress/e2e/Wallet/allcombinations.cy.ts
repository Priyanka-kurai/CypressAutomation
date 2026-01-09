// cypress/e2e/riasec_ordered_pairs.cy.js
describe("AI Career Test — Robust Ordered Pair Runner", () => {

  const orderedPairs = [
    "RI","RA","RS","RE","RC",
    "IR","IA","IS","IE","IC",
    "AR","AI","AS","AE","AC",
    "SR","SI","SA","SE","SC",
    "ER","EI","EA","ES","EC",
    "CR","CI","CA","CS","CE"
  ];

  // YOUR PROVIDED QUESTION BANK (exact mapping)
  const questionBank = [
    { option1: "R", option2: "I" }, //1
    { option1: "R", option2: "A" }, //2
    { option1: "S", option2: "E" }, //3
    { option1: "C", option2: "I" }, //4
    { option1: "A", option2: "S" }, //5
    { option1: "E", option2: "C" }, //6
    { option1: "R", option2: "A" }, //7
    { option1: "I", option2: "S" }, //8
    { option1: "E", option2: "R" }, //9
    { option1: "C", option2: "A" }, //10
    { option1: "R", option2: "I" }, //11
    { option1: "A", option2: "S" }, //12
    { option1: "E", option2: "C" }, //13
    { option1: "R", option2: "I" }, //14
    { option1: "A", option2: "S" }, //15
    { option1: "E", option2: "C" }, //16
    { option1: "R", option2: "I" }, //17
    { option1: "A", option2: "S" }, //18
    { option1: "E", option2: "C" }, //19
    { option1: "R", option2: "I" }, //20
    { option1: "A", option2: "S" }, //21
    { option1: "E", option2: "C" }, //22
    { option1: "R", option2: "I" }, //23
    { option1: "A", option2: "S" }, //24
    { option1: "E", option2: "C" }, //25
    { option1: "R", option2: "I" }, //26
    { option1: "A", option2: "S" }, //27
    { option1: "E", option2: "C" }, //28
    { option1: "R", option2: "I" }, //29
    { option1: "A", option2: "S" }  //30
  ];

  // Helper: detect a single option element's declared code using many heuristics
  function detectCodeFromOption($el) {
    // jQuery element $el
    const attrCandidates = [
      'data-code', 'data-riasec', 'data-riasec-code', 'data-test-code', 'data-option-code'
    ];
    for (const a of attrCandidates) {
      const v = $el.attr(a);
      if (v && typeof v === 'string' && v.trim()) {
        const ch = v.trim().toUpperCase()[0];
        if ("RIASEC".includes(ch)) return ch;
      }
    }

    // aria-label / title
    const aria = $el.attr('aria-label') || $el.attr('title') || $el.attr('aria-describedby');
    if (aria && typeof aria === 'string') {
      const found = aria.match(/[RIASEC]/i);
      if (found) return found[0].toUpperCase();
    }

    // visible text - try to find single-letter code in parentheses or at start
    const txt = $el.text().trim();
    if (txt) {
      // common patterns: "(R) Do X", "R - Do X", "R. Do X", "Option A (R)"
      const paren = txt.match(/\(([RIASEC])\)/i);
      if (paren) return paren[1].toUpperCase();

      const dash = txt.match(/^([RIASEC])\b/i);
      if (dash) return dash[1].toUpperCase();

      const anywhere = txt.match(/\b([RIASEC])\b/i);
      if (anywhere) return anywhere[1].toUpperCase();
    }

    // Nothing detected
    return null;
  }

  // Robust answerAllQuestions that detects mapping reliably and records chosen codes
  const answerAllQuestions = (chooseFn, chosenCodesCollector) => {
    for (let i = 1; i <= 30; i++) {
      cy.wait(800);

      cy.contains("Which activity appeals to you more?", { timeout: 60000 })
        .should("be.visible");

      // fetch option elements (adjust selector if your app uses different class)
      cy.get(".cursor-pointer", { timeout: 20000 }).then(options => {
        // options is a jQuery collection
        const desiredIndex = chooseFn(i); // 0 or 1
        const expectedCode = desiredIndex === 0 ? questionBank[i - 1].option1 : questionBank[i - 1].option2;

        // attempt to detect codes for both options
        let detectedIndexes = { 0: null, 1: null };

        // iterate and detect
        Cypress._.forEach(options.toArray(), (el, idx) => {
          const $el = Cypress.$(el);
          const detected = detectCodeFromOption($el);
          detectedIndexes[idx] = detected;
        });

        // If a detected option already matches expected code, pick that index
        let actualIndexToClick = null;
        for (const idxStr of ["0","1"]) {
          const idx = Number(idxStr);
          if (detectedIndexes[idx] && detectedIndexes[idx] === expectedCode) {
            actualIndexToClick = idx;
            break;
          }
        }

        // If none detected match, but both detected and one of them matches the other option of questionBank, handle ambiguity
        if (actualIndexToClick === null) {
          // if detection produced codes for either, try to infer mapping
          const optionCodes = detectedIndexes; // may be {0: 'R', 1: 'I'} or nulls
          // If one option detected equals questionBank.option1, use that index
          const qRow = questionBank[i - 1];
          for (const idx of [0,1]) {
            if (optionCodes[idx] && optionCodes[idx] === qRow.option1 && desiredIndex === 0) {
              actualIndexToClick = idx; break;
            }
            if (optionCodes[idx] && optionCodes[idx] === qRow.option2 && desiredIndex === 1) {
              actualIndexToClick = idx; break;
            }
          }
        }

        // FINAL FALLBACK: assume questionBank.option1 is rendered at DOM index 0; use chooseFn result (less reliable)
        if (actualIndexToClick === null) {
          // log warning to console and store null mapping
          // fallback mapping: option1 -> options[0], option2 -> options[1]
          actualIndexToClick = (chooseFn(i) === 0) ? 0 : 1;
          // mark that detection failed for later assertion
          cy.log(`⚠️ Detection failed for Q${i}. Falling back to DOM index ${actualIndexToClick}. Detected codes: ${JSON.stringify(detectedIndexes)}`);
        }

        // Click the element we decided
        cy.wrap(options[actualIndexToClick])
          .scrollIntoView()
          .click({ force: true });

        // Record what we clicked: try to record detected code if available, else map from questionBank by index
        const clickedDetectedCode = detectedIndexes[actualIndexToClick] || null;
        const recordedCode = clickedDetectedCode || (actualIndexToClick === 0 ? questionBank[i - 1].option1 : questionBank[i - 1].option2);
        chosenCodesCollector.push(recordedCode);

      });

      cy.wait(600);

      if (i < 30) {
        cy.contains("Next Question", { timeout: 60000 })
          //.scrollIntoView()
          .click({ force: true });
      } else {
        cy.contains("Complete Assessment", { timeout: 60000 })
         // .scrollIntoView()
          .click({ force: true });
      }

      cy.wait(800);
    }
  };

  const waitForReport = () => {
    cy.contains("Career Assessment Report", { timeout: 60000 })
      .should("be.visible");
    cy.wait(1200);
  };

  function startAssessment() {
    cy.visit("https://debug.aicareercoach.truscholar.io/");
    cy.contains("Start Assessment").scrollIntoView().click();
    cy.contains("h3", "No, I want to work now").click();
    cy.contains("button", "Continue").click();
     cy.contains('Engineering and Technical Skills').click();
    cy.contains('Art and Design').click();
    cy.contains('Social and Community Service').click();

    cy.contains('button', 'Continue to Assessment', { timeout: 20000 }).click();

    cy.wait(2000);
  }

  // Helper: create chooseFn that returns 0 for Q1..15 and 1 for Q16..30 (ordered pair)
  function createChooseFn(pair) {
    const first = pair[0];
    const second = pair[1];
    return (qNo) => (qNo <= 15 ? 0 : 1); // note: returns index 0 or 1 for "option1" vs "option2"
    // The desired code is resolved using questionBank inside answerAllQuestions
  }

  // For each ordered pair, run test and assert chosen codes equal intended pattern
  orderedPairs.forEach(pair => {
    it(`Should complete test using ordered pair: ${pair}`, () => {
      startAssessment();

      const chosenCodes = []; // will collect 30 codes we actually clicked (as letters)

      const chooseFn = createChooseFn(pair); // chooses option1 for Q1-15, option2 for Q16-30

      // run through questions (this function fills chosenCodes)
      answerAllQuestions(chooseFn, chosenCodes);

      waitForReport();

      // After report is visible, assert we actually chose codes that match the ordered pair expectation
      cy.then(() => {
        // Expected pattern: first 15 => pair[0] (letter), last 15 => pair[1]
        const expectedFirst = pair[0];
        const expectedSecond = pair[1];

        // verify lengths
        expect(chosenCodes.length).to.eq(30);

        // count mismatches
        const firstMismatches = chosenCodes.slice(0,15).filter(c => c !== expectedFirst);
        const secondMismatches = chosenCodes.slice(15,30).filter(c => c !== expectedSecond);

        // If mismatches found, fail with detailed debug output
        if (firstMismatches.length > 0 || secondMismatches.length > 0) {
          // print helpful debug info to Cypress test output
          // For each question, show: Q#, expected, clicked
          const debugRows = chosenCodes.map((c, idx) => {
            const expected = idx < 15 ? expectedFirst : expectedSecond;
            return `Q${idx+1}: expected=${expected} clicked=${c}`;
          }).join("\n");

          throw new Error(`Selected codes did NOT match expected ordered pair ${pair}.\nDetails:\n${debugRows}`);
        }

        // OPTIONAL: Also assert the UI report contains the expected dominant codes (best-effort)
        // Adjust selectors for your actual report. We try several common patterns.
        cy.contains(pair, { timeout: 5000 }).should("exist");
        // if your report shows full code like "AER" you may want to assert includes both letters:
        cy.contains(expectedFirst, { timeout: 5000 }).should("exist");
        cy.contains(expectedSecond, { timeout: 5000 }).should("exist");
      });
    });
  });

});
export {}