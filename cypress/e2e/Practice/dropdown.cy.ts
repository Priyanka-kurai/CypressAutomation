describe("Dropdown test on ExpandTesting", () => {
  const values = ["Option 1", "Option 2"];

  beforeEach(() => {
    cy.visit("https://practice.expandtesting.com/dropdown");
  });

  it("loops through dropdown values", () => {
    values.forEach((val) => {
      cy.get("#dropdown").select(val);
      cy.get("#dropdown option:selected").should("have.text", val);
    });
  });
});
export {};