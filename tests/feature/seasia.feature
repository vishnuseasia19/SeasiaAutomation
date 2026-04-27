Feature: User Profile

  @smoke
  Scenario: User login and view profile
    Given the user is on the login page
    When the user logs in with valid credentials
    Then the user profile page should be displayed