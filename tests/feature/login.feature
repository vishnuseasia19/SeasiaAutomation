# my approach----->>>>

# Feature : user login Feature

# @smoke  
# Scenario: successfull user login
#  Given user is on login page 
#  When user login with valid credentials 
#  Then user navigates to dashboard
#---------------------------------------------------------------
# AI approach----->>>>

Feature: User Login

  @login
  Scenario Outline: Successful login with valid credentials
    Given the user is on the login page
    When the user enters username "<username>" and password "<password>"
    And clicks on the login button
    Then the user should be redirected to the dashboard

  Examples:
    | username  | password    |
    | 4076      | Vishnu@1915 |