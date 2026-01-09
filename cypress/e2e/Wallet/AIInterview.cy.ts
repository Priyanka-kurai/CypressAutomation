describe('Interview Form Multi-Step Test', () => {

  // ---------- TYPES ----------
  type Domain = {
    id: string;
    name: string;
    keyword: string;
  };

  // ---------- PERMISSIONS ----------
  before(() => {
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Browser.grantPermissions',
        params: {
          permissions: ['videoCapture', 'audioCapture'],
          origin: 'https://frontend-v2-712919537046.asia-southeast1.run.app',
        },
      })
    );
  });

  it('should complete entire interview setup flow with random values', () => {

    // ---------- VISIT ----------
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

    const companies = [
      'Google','Microsoft','Amazon','Apple','Meta',
      'Tesla','Netflix','Adobe','Oracle','IBM'
    ];

    const randomCompany = companies[Math.floor(Math.random() * companies.length)];

    cy.get('input[placeholder="Enter company or your name"]')
      .clear()
      .type(randomCompany);

    cy.get('select').eq(0).select('domain-specific');
    cy.get('select').eq(1).select('en');

    cy.contains('button', 'Next').click();

    // ================= STEP 2 =================
    const domains: Domain[] = [
      { id: '6874b488e8d5483ad607a066', name: 'Art & Design', keyword: 'design' },
      { id: '6874b488e8d5483ad607a067', name: 'Customer Service', keyword: 'customer' },
      { id: '6874b488e8d5483ad607a068', name: 'Education', keyword: 'education' },
      { id: '6874b488e8d5483ad607a069', name: 'Engineering', keyword: 'engineering' },
      { id: '6874b488e8d5483ad607a06a', name: 'Finance', keyword: 'finance' },
      { id: '6874b488e8d5483ad607a06b', name: 'Healthcare', keyword: 'healthcare' },
      { id: '6874b488e8d5483ad607a06c', name: 'Hospitality', keyword: 'hospitality' },
      { id: '6874b488e8d5483ad607a06d', name: 'Human Resources', keyword: 'hr' },
      { id: '6874b488e8d5483ad607a06e', name: 'Information Technology', keyword: 'it' },
      { id: '6874b488e8d5483ad607a06f', name: 'Legal', keyword: 'legal' },
      { id: '6874b488e8d5483ad607a070', name: 'Marketing', keyword: 'marketing' },
      { id: '6874b488e8d5483ad607a071', name: 'Real Estate', keyword: 'realestate' },
      { id: '6874b488e8d5483ad607a072', name: 'Sales', keyword: 'sales' },
      { id: '6874b488e8d5483ad607a073', name: 'Supply Chain & Logistics', keyword: 'logistics' },
    ];

    const selectedDomain = domains[Math.floor(Math.random() * domains.length)];
    cy.wrap(selectedDomain).as('selectedDomain');

    cy.get('select').eq(0).select(selectedDomain.id);

    cy.get('select').eq(1).should('not.be.disabled')
      .find('option')
      .then(options => {
        const valid = [...options].filter(o => o.value);
        cy.get('select').eq(1).select(valid[0].value);
      });

    cy.contains('button', 'Next').click();

    // ================= STEP 3 =================
    cy.get('input[value="skills-based"]').check();

    cy.get('div.flex.flex-wrap button').then($btns => {
      [...$btns].slice(0, 3).forEach(btn => {
        cy.wrap(btn).click();
      });
    });

    cy.contains('Start Interview').click();

    // ================= STEP 5 =================
    cy.get<Domain>('@selectedDomain').then(domain => {

      const usedAnswers = new Set<string>();

      const answerQuestion = (qNo: number) => {

        cy.contains(`Question ${qNo} of`, { timeout: 15000 }).should('be.visible');

        cy.get('body').then($body => {

          const text = $body.text().toLowerCase();
          let category: keyof typeof answers.engineering = 'default';

          if (text.includes('introduce') || text.includes('background')) category = 'introduce';
          else if (text.includes('technical') || text.includes('skills')) category = 'technical';
          else if (text.includes('project')) category = 'project';
          else if (text.includes('challenge')) category = 'challenge';

          const bank = answers[domain.keyword] || answers.engineering;
          const pool = bank[category] || bank.default;

          let available = pool.filter(a => !usedAnswers.has(a));
          let answer = available.length
            ? available[Math.floor(Math.random() * available.length)]
            : `Based on my experience in ${domain.name}, I continuously improve my skills and deliver results.`;

          usedAnswers.add(answer);

          cy.get('textarea').clear().type(answer, { delay: 25 });
        });

        cy.contains('Post Answer').click();
        cy.contains('Answer Submitted', { timeout: 30000 }).should('be.visible');

        if (qNo < 5) {
          cy.contains('Next Question').click();
        }
      };

      cy.wrap([1, 2, 3, 4, 5]).each(q => {
        answerQuestion(q);
      });

    });

    // ================= STEP 6 =================
    cy.contains('Get Assessment!').click();
  });
});

// ---------- ANSWERS ----------
const answers: any = {
  engineering: {
    introduce: [
      "I'm a software engineer with strong backend and system design experience.",
      "I have experience building scalable systems using modern technologies."
    ],
    technical: [
      "I work with APIs, databases, cloud platforms, and CI/CD pipelines."
    ],
    project: [
      "I led the development of high-traffic services with strong reliability."
    ],
    challenge: [
      "I solved production issues by debugging logs and optimizing performance."
    ],
    default: [
      "I approach problems systematically and focus on quality delivery."
    ]
  }
};

export {};
