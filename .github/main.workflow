workflow "Build, Lint and Test" {
  on = "push"
  resolves = ["Lint", "Test"]
}

action "Build" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  args = "install"
}

action "Lint" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  needs = ["Build"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  needs = ["Build"]
  args = "test"
}
