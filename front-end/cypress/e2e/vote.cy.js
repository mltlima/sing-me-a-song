import recommendationFactory from './factories/recommendationFactory.js';

describe('Upvote /', () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it('Should test upvote rote', () => {
    const recommendation = recommendationFactory();
    cy.visit('localhost:3000');
    cy.intercept('POST', '/recommendations').as('getRecommendations');
    cy.insertRecommendation(recommendation);
    cy.contains(recommendation.name);
    cy.contains(recommendation.name)
      .get('article')
      .within(() => {
        cy.get('svg:first-of-type').click();
      });
    cy.contains('1');
    cy.end();
  });
});

describe('downvote /', () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it('Should test downvote rote', () => {
    const recommendation = recommendationFactory();
    cy.visit('localhost:3000');
    cy.intercept('POST', '/recommendations').as('getRecommendations');
    cy.insertRecommendation(recommendation);
    cy.contains(recommendation.name);
    cy.contains(recommendation.name)
      .get('article')
      .within(() => {
        cy.get('svg:last-of-type').click();
      });
    cy.contains(-1);
    cy.end();
  });
});