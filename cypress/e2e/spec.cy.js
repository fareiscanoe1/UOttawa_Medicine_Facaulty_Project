describe('Azure Active Directory Authentication', () => {
  beforeEach(() => {
    // log into Azure Active Directory through our sample SPA using our custom command
    cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
    cy.visit('http://localhost:3000/dashboard')
  })

  it("tests Question test", () => {
    cy.viewport(2005, 1291);
    cy.get("button[name='loginBtn']").click();
    cy.get("button[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-qkvt3p-MuiButtonBase-root-MuiIconButton-root']").click();
    cy.get("a[href='/dashboard/questions']").click();
    cy.get("div.css-d3ri6l-MuiStack-root > button").click();
    cy.get("#trackingNumber").click();
    cy.get("#trackingNumber").type("154862");
    cy.get("body").click();
    cy.get("#type").click();
    cy.get("li:nth-of-type(2)").click();
    cy.get("[data-testid='MUIDataTableBodyRow-0'] button").click();
    cy.get("#english").click();
    cy.get("#english").type("test");
    cy.get("#french").click();
    cy.get("#french").type("test");
    cy.get("#reference").click();
    cy.get("#reference").type("none");
    cy.get("form > div > div > div.MuiBox-root > button.MuiButton-containedPrimary").click();
    cy.get("#\\:r11\\:").click();
    cy.get("#\\:r11\\:").type("test");
    cy.get("#\\:r12\\:").click();
    cy.get("#\\:r12\\:").type("test");
    cy.get("div.MuiPaper-root input").click();
    cy.get("div.css-1a5n0ew-MuiGrid-root button").click();
  });

  it("tests Edit Question", () => {
    cy.viewport(2005, 1291);
    cy.get("button[name='loginBtn']").click();
    cy.get("button[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-qkvt3p-MuiButtonBase-root-MuiIconButton-root']").click();
    cy.get("a[href='/dashboard/questions']").click();
    cy.get("[data-testid='MuiDataTableBodyCell-3-0']").click();
    cy.get("#english").click();
    cy.get("#english").type("edit question test");
    cy.get("div.css-19ky2cl-MuiGrid-root button").click();
  });
  it("tests Create Exam", () => {
    cy.viewport(1749, 1291);
    cy.get("button[name='loginBtn']").click();
    cy.get("button[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-qkvt3p-MuiButtonBase-root-MuiIconButton-root']").click();
    cy.get("a[href='/dashboard/exams']").click();
    cy.get("div.css-d3ri6l-MuiStack-root > button").click();
    cy.get("button[class='MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-wdsdfe-MuiButtonBase-root-MuiTab-root']").contains('All Questions').click();
    cy.get("th:nth-of-type(5) div.tss-1akey0g-MUIDataTableHeadCell-data").click();
    cy.get("[data-testid='MuiDataTableBodyCell-6-1'] button").click();
    cy.get("[data-testid='MuiDataTableBodyCell-6-2'] button").click();
    cy.get("button[class='MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-wdsdfe-MuiButtonBase-root-MuiTab-root']").contains('CDMQ').click();
    cy.get("[data-testid='MuiDataTableBodyCell-6-0'] button").click();
    cy.get("[data-testid='MuiDataTableBodyCell-6-3'] button").click();
    cy.get("[data-testid='MuiDataTableBodyCell-6-4'] button").click();
    cy.get("#examName").click();
    cy.get("#examName").type("Auto Test1");
    cy.get("form > button").click();
    cy.get("header svg").click();
    cy.get("a.active > div.MuiListItemText-root").click();
  });
  it("tests View Exam Setup", () => {
    cy.viewport(1624, 1291);
    cy.get("button[name='loginBtn']").click();
    cy.get("button[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-qkvt3p-MuiButtonBase-root-MuiIconButton-root']").click();
    cy.get("a[href='/dashboard/exams']").click();
    cy.get("[data-testid='MuiDataTableBodyCell-0-0'] > div:nth-of-type(2)").click();
    cy.get("input[id=':rs:']").click();
    cy.get("input[id=':rs:']").type('{backspace}')
    cy.get("input[id=':rs:']").type('{backspace}')
    cy.get("input[id=':rs:']").type('{backspace}')
    cy.get("input[id=':rs:']").type("-1");
    cy.get("[data-testid='MuiDataTableBodyCell-10-0'] button").click();
    cy.get("input[id=':rt:']").click();
    cy.get("input[id=':rt:']").type('{backspace}')
    cy.get("input[id=':rt:']").type('{backspace}')
    cy.get("input[id=':rt:']").type('{backspace}')
    cy.get("input[id=':rt:']").type("-1");
    cy.get("[data-testid='MuiDataTableBodyCell-11-0'] button").click();
    cy.get("input[id=':ru:']").click();
    cy.get("input[id=':ru:']").type('{backspace}')
    cy.get("input[id=':ru:']").type(" ");
    cy.get("[data-testid='MuiDataTableBodyCell-12-0'] button").click();
    cy.get("button[class='MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-wdsdfe-MuiButtonBase-root-MuiTab-root']").contains('CDMQ').click();
    cy.get("input[id=':r1k:']").click();
    cy.get("input[id=':r1k:']").type('{backspace}')
    cy.get("input[id=':r1k:']").type('{backspace}')
    cy.get("input[id=':r1k:']").type('{backspace}')
    cy.get("input[id=':r1k:']").type("-1");
    cy.get("[data-testid='MuiDataTableBodyCell-10-0'] button").click();
    cy.get("input[id=':r1l:']").click();
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type("-1");
    cy.get("[data-testid='MuiDataTableBodyCell-11-0'] button").click();
    cy.get("input[id=':r1m:']").click();
    cy.get("input[id=':r1m:']").type('{backspace}')
    cy.get("input[id=':r1m:']").type(" ");
    cy.get("#root > div > div > div.MuiBox-root > div").click();
    cy.get("[data-testid='MuiDataTableBodyCell-12-0'] button").click();
    cy.get("header svg").click();
    cy.get("a.active > div.MuiListItemText-root").click();
  });

  it("tests View Exam", () => {
    cy.viewport(1624, 1291);
    cy.get("button[name='loginBtn']").click();
    cy.get("button[class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-qkvt3p-MuiButtonBase-root-MuiIconButton-root']").click();
    cy.get("a[href='/dashboard/exams']").click();
    cy.get("[data-testid='MuiDataTableBodyCell-0-0']").click();
    cy.get("input[id=':rs:']").click();
    cy.get("input[id=':rs:']").type('{backspace}')
    cy.get("input[id=':rs:']").type('{backspace}')
    cy.get("input[id=':rs:']").type('{backspace}')
    cy.get("input[id=':rs:']").type("0.6");
    cy.get("[data-testid='MuiDataTableBodyCell-10-0'] button").click();
    cy.get("input[id=':rt:']").click();
    cy.get("input[id=':rt:']").type('{backspace}')
    cy.get("input[id=':rt:']").type('{backspace}')
    cy.get("input[id=':rt:']").type('{backspace}')
    cy.get("input[id=':rt:']").type("0.4");
    cy.get("[data-testid='MuiDataTableBodyCell-11-0'] button").click();
    cy.get("input[id=':ru:']").click();
    cy.get("input[id=':ru:']").type('{backspace}')
    cy.get("input[id=':ru:'").type("1");
    cy.get("[data-testid='MuiDataTableBodyCell-12-0'] button").click();
    cy.get("button[class='MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-wdsdfe-MuiButtonBase-root-MuiTab-root']").contains('CDMQ').click();
    cy.get("input[id=':r1k:']").click();
    cy.get("input[id=':r1k:']").type('{backspace}')
    cy.get("input[id=':r1k:']").type('{backspace}')
    cy.get("input[id=':r1k:']").type('{backspace}')
    cy.get("input[id=':r1k:']").type("0.4");
    cy.get("[data-testid='MuiDataTableBodyCell-10-0'] button").click();
    cy.get("input[id=':r1l:']").click();
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type("0.8");
    cy.get("[data-testid='MuiDataTableBodyCell-11-0'] button").click();
    cy.get("input[id=':r1l:']").click();
    cy.get("input[id=':r1l:']").type('{backspace}')
    cy.get("input[id=':r1l:']").type("1");
    cy.get("[data-testid='MuiDataTableBodyCell-12-0'] button").click();
    cy.get("rect:nth-of-type(2)").click();
    cy.get("a.active > div.MuiListItemText-root").click();
  });

  
})