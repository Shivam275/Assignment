Feature: Admin User Management

  As an OrangeHRM administrator
  I want to manage system users
  So that user access can be maintained correctly

  Background:
    Given I am logged into OrangeHRM as an administrator
    And I navigate to the User Management page

  @smoke @regression
  Scenario: Search for an existing user
    When I search for user "Admin"
    Then the user "Admin" should be displayed in the results

  @regression
  Scenario: Create a new user
    When I create a new user with valid details
    Then the user should be created successfully
    And the newly created user should be displayed in the user list

  @regression
  Scenario: Update an existing user
    Given I have created a user with valid details
    When I search for the newly created user
    And I update the user details
    Then the user details should be updated successfully

  @regression
  Scenario: Filter users by status
    When I filter users with status "Enabled"
    Then only enabled users should be displayed

  @smoke @regression
  Scenario: Logout from OrangeHRM
    When I logout from OrangeHRM
    Then I should be redirected to the login page

  @regression
  Scenario: Validate mandatory fields while creating a user
    When I open the create user form
    And I click Save without entering mandatory details
    Then validation messages should be displayed

  @regression
  Scenario: Search for a nonexistent user
    When I search for user "invalid_user_12345"
    Then no matching users should be displayed
