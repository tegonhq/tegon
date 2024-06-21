<p align="center">
  (In progress: We are redesigning our product and will be back to our normal feature implementation in a few weeks.)
</p>

<p align="center">
  <a href="https://tegon.ai"><img src="https://github.com/tegonhq/tegon/assets/17528887/07036ee1-774d-4dff-a56b-8050041f36ce" width="200" height="100" /></a>
</p>

<div align="center">

[![Star us on GitHub](https://img.shields.io/github/stars/tegonhq/tegon?color=FFD700&label=Stars&logo=Github)](https://github.com/tegonhq/tegon)

[![Join our Slack Server](https://img.shields.io/badge/Slack-Join%20our%20community-1da1f2?style=flat&logo=slack&logoColor=%23fff)](https://join.slack.com/t/tegoncommunity/shared_invite/zt-2jvar8p1x-9wqFTL9PP5ICImb76qcjEA)
[![Tweet at us on Twitter](https://img.shields.io/badge/Twitter-tweet%20at%20us-1da1f2?style=flat&logo=twitter&logoColor=%23fff)](https://twitter.com/tegonhq)

[Love Tegon? Give us a ⭐ on GitHub!](https://github.com/tegonhq/tegon)

</div>

<p align="center">
<a> <img src= "https://github.com/tegonhq/tegon/assets/36505468/888ebcaa-29fb-4f33-833f-9652bdd37711" /></a>
</p>

<p align="center">
    <em> Tegon is AI-First Issue Tracking tool for engineering teams
</em>
</p>

[Tegon](https://tegon.ai) is an AI-first, open-source issue tracking software that uses AI to smartly automate manual task, workflows or provide more context to engineers for a given task.

Issue Tracking is important for fast-paced teams, enabling them to organize list of tasks, collaborate, and track progress effectively. However, existing tools often introduce the following challenges:

- Manual efforts in task management, such as task triaging and backlog maintenance, can be time-consuming.
- Engineers often waste time navigating multiple platforms to gather task context, rather than accessing details within the task itself.
- Issue tracking tools serve as a task database, directing engineers on what to work on but not aiding in faster task completion.
- Existing tools don't effectively assist Engineering Managers in real-time task, feature, or bug prioritisation.

## Self Hosted
To self-host Tegon on your own machine, you can do so using Docker. However note that you will need to add configurations for email, AI and storage services. Please refer to the documentation [here](https://docs.tegon.ai/oss/deploy-tegon).

## Tegon Cloud

We offer a managed cloud version of Tegon that allows you to run Tegon without having to manage the infrastructure. It is currently in private beta. 
If you're interested in using Tegon Cloud, please book a [demo call](https://calendly.com/manik-sync/talk-to-us).

## Features

- Issues Tracking (List and Kanban View)
- Automatically create a title from the description, eliminating the need to spend time crafting the perfect title
- Suggest labels and assignees from the description
- Custom Views
- Identify duplicate issues
- Sprints (coming soon)
- Task Prioritisation (coming soon)
- Suggest Stack Overflow references for Sentry-linked bug issues (coming soon)

## Integrations

- Github: Automatically update issues status based on commits and pull requests and link mentions of issues back to Tegon
- Slack:
  - Mention the Tegon bot in a Slack channel to automatically create a bug or feature request.
  - Link a Slack thread to an issue to provide full context about the discussions happening on a specific task or a feature request.
- Sentry: Get information about Sentry errors in Tegon issues

## Command Centre for Agents (Coming Soon)

We're building a command centre for agents that will run multiple agents:

- Code Review Agent: Reviews linked pull requests for new tasks, ensuring code quality by preventing the incorporation of suboptimal code.
- Bug Agent: Upon bug assignment, will attempt to reproduce the bug, propose solutions, and in some cases, even implement these solutions in a new PR.
- Task Prioritisation Agent: Assists team leaders in managing the sprint by doing a real-time assessment of the tasks, priority, and bandwidth and suggesting changes to be made.

## Contributing

Whether it's big or small, we love contributions. Not sure where to get started? 
You can join our [Slack](https://join.slack.com/t/tegoncommunity/shared_invite/zt-2i1e781ip-zwauijRV9TRtRKoJi3tqng), and ask us any questions there.

## License

The product is under the [MIT License](https://github.com/tegonhq/tegon/blob/main/LICENSE.md)

