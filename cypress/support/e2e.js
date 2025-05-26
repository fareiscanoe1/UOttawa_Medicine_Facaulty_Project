// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
// cypress/support/e2e.ts

function loginViaAAD(username, password) {
    cy.visit('http://localhost:3000/')
    cy.get('button[name="loginBtn"]').click()
  
    // Login to your AAD tenant.
    cy.origin(
      'login.microsoftonline.com',
      {
        args: {
          username,
        },
      },
      ({ username }) => {
        cy.get('input[type="email"]').type(username, {
          log: false,
        })
        cy.get('input[type="submit"]').click()
      }
    )
    console.log(username)
    // depending on the user and how they are registered with Microsoft, the origin may go to live.com
    cy.origin(
      'login.microsoftonline.com',
      {
        args: {
          password,
        },
      },
      ({ password }) => {
        cy.get('input[type="password"]').type(password, {
          log: false,
        })
        cy.get('input[type="submit"]').click()
        cy.get('#idBtn_Back').click()
      }
    )
  
    // Ensure Microsoft has redirected us back to the sample app with our logged in user.
    cy.url().should('equal', 'http://localhost:3000/')
    
  }
  
  Cypress.Commands.add('loginToAAD', (username, password) => {
    const log = Cypress.log({
      displayName: 'Azure Active Directory Login',
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    })
    log.snapshot('before')
  
    loginViaAAD(username, password)
  
    log.snapshot('after')
    log.end()
  })