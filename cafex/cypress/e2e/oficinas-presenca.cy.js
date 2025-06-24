describe('Fluxo completo de presença', () => {
  const nomeAluno = 'Aluno Cypress Presenca'
  const nomeOficina = 'Oficina Cypress Presenca'
  const descricao = 'Oficina para teste de presença Cypress'

  beforeEach(() => {
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        return false
      }
    })
  })

  it('Cadastra aluno', () => {
    cy.visit('/alunos')
    cy.get('[data-cy=btn-abrir-cadastro-aluno]').click()
    cy.get('[data-cy=input-nome-aluno]').type(nomeAluno)
    cy.get('[data-cy=btn-confirmar-aluno]').click()
    cy.contains('Aluno cadastrado com sucesso!').should('exist')
    cy.contains(nomeAluno).should('exist')
  })

  it('Cria uma nova oficina e adiciona o aluno', () => {
    cy.visit('/')
    cy.get('[data-cy=btn-abrir-cadastro]').click()
    cy.get('[data-cy=input-nome]').type(nomeOficina)
    cy.get('[data-cy=input-descricao]').type(descricao)
    cy.get('[data-cy=select-dia-semana] .v-input__control').click()
    cy.get('.v-list-item-title').should('contain', 'Segunda-feira')
    cy.get('.v-list-item-title').contains('Segunda-feira').click({ force: true })
    cy.get('[data-cy=input-busca-aluno]').type(nomeAluno)
    cy.get('.v-list-item-title').contains(nomeAluno).click({ force: true })
    cy.get('[data-cy=btn-confirmar]').click()
    cy.contains('Oficina cadastrada com sucesso!').should('exist')
    cy.contains(nomeOficina).should('exist')
    cy.contains(descricao).should('exist')
  })

  it('Marca presença do aluno como PRESENTE', () => {
    cy.visit('/')
    cy.contains(nomeOficina)
      .parents('tr')
      .within(() => {
        cy.get('[data-cy=btn-marcar-presenca]').click({ force: true })
      })
    cy.get('.presenca-modal', { timeout: 10000 }).should('be.visible')

    cy.get('[data-cy=select-status-presenca-0] .v-field__input').click({ force: true })
    cy.get('.v-list-item-title').should('contain', 'Presente')
    cy.get('.v-list-item-title').contains('Presente').click({ force: true })

    cy.contains('Salvar').click({ force: true })

    cy.contains('Presenças salvas!').should('exist')
  })

  it('Consulta presença do aluno', () => {
    cy.visit('/consulta')

    cy.wait(2000)

    cy.get('[data-cy=tabela-consulta-presencas]').should('contain', nomeOficina)

    cy.get('[data-cy=tabela-consulta-presencas]', { timeout: 10000 })
      .contains(nomeOficina)
      .parents('tr')
      .within(() => {
        cy.get('[data-cy=btn-visualizar-presencas]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })
      })

    cy.get('.presenca-modal', { timeout: 10000 }).should('be.visible')
    cy.get('.presenca-modal').within(() => {
      cy.contains(nomeAluno).should('exist')
      cy.contains('Presente').should('exist')
    })
  })

  
  it('Exclui a oficina criada', () => {
    cy.visit('/')
    cy.contains(nomeOficina)
      .parents('tr')
      .within(() => {
        cy.get('[data-cy=btn-excluir]').first().click()
      })
    cy.contains('Confirmar').click()
    cy.contains('Oficina excluída com sucesso!').should('exist')
    cy.contains(nomeOficina).should('not.exist')
  })

    it('Exclui o aluno cadastrado', () => {
        cy.visit('/alunos')
        cy.contains(nomeAluno)
        .parents('tr')
        .within(() => {
            cy.get('[data-cy=btn-excluir-aluno]').first().click()
        })
        cy.contains('Confirmar').click()
        cy.contains('Aluno excluído com sucesso!').should('exist')
        cy.contains(nomeAluno).should('not.exist')
    })
})
