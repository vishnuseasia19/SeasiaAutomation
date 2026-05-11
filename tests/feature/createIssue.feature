Feature: Create Issue

  @smoke
  Scenario: User can create a task issue
    Given the user is on the login page
    When the user logs in with valid credentials
    And the user navigates to the project board
    And the user clicks on create issue
    Then the user fills in task details
    And the user cancels the issue creation
    
    