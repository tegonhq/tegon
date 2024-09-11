## Overview

### Automatically Create a GitHub Issue from Tegon

With this action, you can automatically create a GitHub issue from Tegon based on specific triggers. Here's how it works:

When a designated label is applied to a Tegon issue within a specific team, it will create a corresponding GitHub issue in the specified repository. For example, if you assign the label "GitHub" to a Tegon issue in the "Engineering" team, an issue will be created in the "xyz" repository.

To set up and run this action, you’ll need to provide three key details:
1. The GitHub repository where the issue should be created.
2. The Tegon team associated with the action.
3. The label that will trigger the creation of the GitHub issue.

### Steps to Configure

#### 1. Prerequisite: Integrate GitHub with Tegon

   - Navigate to `Settings -> Overview -> Integrations -> GitHub`.
   - Grant Tegon access to your GitHub account.

#### 2. Configure the Action

   - After connecting your GitHub account, go to `Settings -> Overview -> Actions -> GitHub -> Configuration`.
   - Specify the repository name, Tegon team, and the label that will trigger the action.

### Important Notes
- Only one GitHub repository can be linked to each Tegon team.
- A single label will be used to trigger the action across all linked repositories and teams.
