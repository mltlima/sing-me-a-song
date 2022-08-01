/// <reference types='cypress' />

import recommendationFactory from './factories/recommendationFactory.js';

describe('Home /', () => {
    beforeEach(() => {
      cy.resetDatabase();
    });

    it('should create a new video', () => {
      const recommendation = recommendationFactory();
      cy.visit('localhost:3000');
      cy.intercept('POST', '/recommendations').as('getRecommendations');
      cy.insertRecommendation(recommendation);
      cy.contains(recommendation.name);
      cy.wait('@getRecommendations');
      cy.end();
  });
})