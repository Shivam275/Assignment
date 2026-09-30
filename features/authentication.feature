Feature: Administrator authentication

  @smoke
  Scenario: Administrator can log in
    Given I am logged into OrangeHRM as an administrator
    Then I should see the Dashboard
