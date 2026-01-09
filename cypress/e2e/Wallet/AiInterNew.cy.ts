describe('AI Interview – Full Multi-Step Flow', () => {

  // ================= TYPES =================
  type SelectedDomain = {
    key: 'engineering' | 'finance' | 'healthcare' | 'customer';
  };

  // ================= PERMISSIONS =================
  before(() => {
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['videoCapture', 'audioCapture'],
        origin: 'https://frontend-v2-712919537046.asia-southeast1.run.app',
      },
    });
  });

  it('should complete interview setup and answer questions successfully', () => {

    // ================= VISIT =================
    cy.visit('https://frontend-v2-712919537046.asia-southeast1.run.app', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
          getTracks: () => [],
          getVideoTracks: () => [],
          getAudioTracks: () => [],
        });
      },
    });

    // ================= STEP 1 =================
    cy.get('form').should('be.visible');

    const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];

    cy.get('input[placeholder="Enter company or your name"]')
      .clear()
      .type(randomCompany);

    cy.get('select').eq(0).select('domain-specific');
    cy.get('select').eq(1).select('en');

    cy.contains('button', 'Next')
      .should('not.be.disabled')
      .click();

    // ================= STEP 2 (DOMAIN → ROLE) =================
    const domainRoleMap = {
      engineering: {
        domainValue: '6874b488e8d5483ad607a069',
        roles: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
      },
      finance: {
        domainValue: '6874b488e8d5483ad607a06a',
        roles: ['Accountant', 'Financial Analyst', 'Auditor'],
      },
      healthcare: {
        domainValue: '6874b488e8d5483ad607a06b',
        roles: ['Doctor', 'Healthcare Assistant', 'Medical Officer'],
      },
      customer: {
        domainValue: '6874b488e8d5483ad607a067',
        roles: ['Customer Support Executive', 'Support Analyst', 'Customer Success Manager'],
      },
    } as const;

    const domainKeys = Object.keys(domainRoleMap) as Array<SelectedDomain['key']>;
    const selectedDomainKey =
      domainKeys[Math.floor(Math.random() * domainKeys.length)];

    const selectedDomainConfig = domainRoleMap[selectedDomainKey];

    // ✅ IMPORTANT: typed alias
    cy.wrap<SelectedDomain>({ key: selectedDomainKey }).as('selectedDomain');

    cy.get('select').eq(0).select(selectedDomainConfig.domainValue);

    cy.intercept('GET', '**/roles/**').as('getRoles');
    cy.wait('@getRoles');

    const randomRole =
      selectedDomainConfig.roles[
        Math.floor(Math.random() * selectedDomainConfig.roles.length)
      ];

    cy.get('select').eq(1)
      .should('not.be.disabled')
      .select(randomRole)
      .should('have.value', randomRole);

    cy.contains('button', 'Next')
      .should('not.be.disabled')
      .click();

    // ================= STEP 3 =================
    cy.contains('How should we generate your interview questions?')
      .should('be.visible');

    cy.get('input[value="skills-based"]').check();

    cy.get('div.flex.flex-wrap.gap-2 button', { timeout: 10000 })
      .should('have.length.greaterThan', 2)
      .then($btns => {
        cy.wrap($btns[0]).click();
        cy.wrap($btns[1]).click();
        cy.wrap($btns[2]).click();
      });

    cy.contains('3/5 skills selected').should('be.visible');

    cy.contains('button', 'Start Interview')
      .should('not.be.disabled')
      .click();

    // ================= STEP 4 =================
    cy.wait(3000);

    // ================= STEP 5 (✅ FIXED) =================
    cy.get<SelectedDomain>('@selectedDomain').then((selectedDomain) => {

      const key = selectedDomain.key; // ✅ fully typed
      const used = new Set<string>();

      const answers: Record<SelectedDomain['key'], string[]> = {
        engineering: [
          'I am a backend engineer experienced in APIs and microservices.',
          'I have implemented CI/CD pipelines for automated deployments.',
          'I optimized database queries to improve performance.',
          'I debug production issues using logs and monitoring.',
          'I follow clean code practices and write unit tests.',
        ],
        finance: [
          'I handled financial reporting and reconciliations.',
          'I worked on budgeting and forecasting activities.',
          'I analyzed financial data to identify trends.',
          'I collaborated with teams on financial planning.',
          'I ensured regulatory compliance and audits.',
        ],
        healthcare: [
          'I supported patient care following medical protocols.',
          'I worked with electronic health records.',
          'I assisted in clinical operations and monitoring.',
          'I followed healthcare compliance standards.',
          'I provided compassionate patient support.',
        ],
        customer: [
          'I handled high-volume customer queries.',
          'I resolved customer complaints professionally.',
          'I collaborated with teams to resolve issues.',
          'I tracked customer feedback and metrics.',
          'I built trust through clear communication.',
        ],
      };

      const pool = answers[key];

      const answerQuestion = (qNo: number) => {
        cy.contains(`Question ${qNo} of`, { timeout: 20000 }).should('be.visible');

        const answer = pool.find(a => !used.has(a))!;
        used.add(answer);

        cy.get('textarea')
          .should('be.visible')
          .clear()
          .type(answer, { delay: 20 });

        cy.contains('button', 'Post Answer').click();

        if (qNo < 5) {
          cy.contains('Answer Submitted', { timeout: 30000 }).should('be.visible');
          cy.contains('button', 'Next Question').click();
        } else {
          cy.contains('Interview Finalized!', { timeout: 40000 }).should('be.visible');
        }
      };

cy.wrap([1, 2, 3, 4, 5]).each((qNo: number) => {
  answerQuestion(qNo);
      });

      // ================= STEP 6 =================
      cy.contains('button', 'Get Assessment!', { timeout: 20000 }).click();
      cy.contains('Performance Review', { timeout: 30000 }).should('be.visible');

      cy.scrollTo('bottom');
      cy.contains('button', 'PDF Report')
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
  });
});

export {};
