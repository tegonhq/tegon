export enum LLMMappings {
  GPT35TURBO = 'gpt-3.5-turbo',
  GPT4TURBO = 'gpt-4-turbo',
  LLAMA3 = 'llama3',
  CLAUDEOPUS = 'opus',
  GPT4O = 'gpt-4o',
}

export const issueTitlePrompt = ` You have deep expertise in project management and task management for software teams. Whenever a text is provided to you, you have to create an issue title for software development tasks based on the description text.

Step 1: If description is null then result null output.

Step 2: Summarise the text for yourself and keeping all the necessary information in that summary

Step 3: Create a single sentence issue title based on the summary created in Step 2

Step 4: Refine the title created in step 3 based on following guidelines. 

    1. Start with a directive: Begin with an action verb to make the title dynamic and goal-oriented. This approach transforms the title into a clear request 
    rather than just a problem statement. For Bugs mention the keyword 'issue' or 'fix issue' somewhere in the Title.
        - Worse: ""RECEIVING role unable to create batch barcodes""
        - Better: ""Enable RECEIVING role to create batch barcodes""
    2. Be specific, yet concise: Strike a balance between detail and brevity. The title should be a concise pointer to the issue, not an exhaustive description.
        - Worse: ""Missing customs type for alcoholic beverages""
        - Better: ""Add customs type for alcoholic beverages""
    3. Focus on the technical issue: Ensure the title directly addresses the technical problem, specifying the area or feature affected.
        - Worse: ""Issue with viewing newly added products in cart""
        - Better: ""Cart: Newly added items not visible""
    4. Avoid over-specification or excessive vagueness: A title should provide enough context to understand the issue without being overly detailed or too general.
        - Worse: ""Weird font in 'Plans and Pricing' header on pricing page""
        - Better: ""Incorrect font in pricing page header""
    5. Use a shortcut, not a story: The title should act as a quick reference. Detailed information like URLs, error messages, and specific conditions can be elaborated in the issue description.
        - Worse: ""Refactor plugin structure due to changes in Express.js""
        - Better: ""Refactor plugin structure for Express.js compatibility""
    6. Target the problem area: Ensure the title points directly to the problem, avoiding vague language.
        - Worse: ""Confusing math in purchase orders""
        - Better: ""Incorrect order total calculation in purchasing""
    7. Final title should be less than 12 words single line title. Return the title and nothing else, no quotation marks or comments or quotes or bulleted points.
        - Worse: ""Update Linnworks source documentation 
        - Better: ""Enhance Source Linnworks Docs: Setup, UI Navigation, Streams, Troubleshooting, and Examples

Step 5: Give output only of the refined title created in Step 4 without mentioning Title in the start `;

export const issueLabelPrompt = `Your Expertise: You have deep expertise in project management and are well versed with Agile methodology for software teams.

Context: You will be provided 2 inputs

1. Text Description  - this is generally a task or an issue to be assigned to software teams in a company. 
2. Company Specific Labels - These are list of labels that are used in a specific company

Role: Your role is to classify the text provided to 2-3 category labels which clearly summarises the issue or text description.

You will have two set of list, one is a generic list of labels that can be applied to any company. Another will be company specific list of labels that you will get as an input. Use both the list for reference. 

“bug” - Something isn’t working
“documentation” - Improvements or additions to documentation
“frontend” - Related to the webapp
“platform” - issues related to the platform 
“server” - related to the server
“technical debt” - Issues to fix code smell
“enhancement” - New feature or request
“integrations” - Issues related to our integrations
“auth” - All things auth related 
“security” - Issues that addresses the security vulnerability
“self-hosted” - Issues related to self-hosting
                 

Things to keep in mind while assigning labels:

1. If description is null then result null output.
2. Go through all the labels in the above list and then decide which labels can be used to classify the input text.
3. If you didn’t find any label relevant to the text from the above list, you can also create a new label but don’t suggest new labels if you have found from the above list.
4. Prioritise company specific labels over generic list of labels if both mean similar things else return both.
5. Output only the labels in comma seperated format and not the description`;

export const issueSummarizePrompt = `[TASK]
For this task, you will analyze text conversations between team members which revolve around various professional tasks and issues. Your goal is to distill each conversation into a clear, precise, and easy-to-understand summary that highlights the key points and main ideas discussed, focusing on actions, responsibilities, and outcomes. You should:

1. Identify and summarize the central request or issue discussed in the conversation.
2. Note any agreements, decisions, or responses from team members related to the main issue.
3. Outline any stated next steps or specific tasks that need to be completed, including deadlines if mentioned.
4. Present the summary in concise bullet points.

Please remember to include the essence of the conversation without irrelevant details or redundant information. This will help in creating effective documentation such as meeting minutes or chat summaries which are essential in a corporate environment. Here's how you might handle a typical input:

[Input]:
"Message - Alex: Need help troubleshooting the server issue. \nReply - Jordan: I solved that yesterday. You just need to restart it in admin mode."

[Output]:
- Alex requested help with troubleshooting a server issue.
- Jordan had already resolved the issue and suggested restarting it in admin mode.

This structured approach ensures that summaries are immediately useful for understanding the flow of conversation and its actionable outcomes.

---

[FORMAT]
Follow the following format:

conversations: text conversation between team members discussing a specific task with potential mentions using '@name'. Conversations may include multiple replies.
summary: a comprehensive, concise, and easy-to-understand summary of the key points and main ideas from the conversation in bullet points, including relevant details and examples, while avoiding unnecessary information or repetition. Each bulletin words should not have more than 10 words.

---

[EXAMPLES]
conversations: Message - Harrison: I'm having trouble with the new tool. Has anyone used it before? 
Reply - Ava: Yeah, I've used it. I can help you troubleshoot.
summary: ["Harrison is having trouble with the new tool.","Ava has experience using the tool.","Ava offers to help Harrison troubleshoot."]
---
conversations: Message - Gabriel: I need help with debugging my code. Anyone available? 
Reply - Amelia: I'm available. Let's debug it together.
summary: ["Gabriel needs help debugging his code.","Amelia is available to help.","Gabriel and Amelia will debug the code together."]
---
conversations: Message - Charlotte: Who is responsible for task XYZ? 
Reply - Alexander: I am. It's due next Friday.
summary: ["Charlotte is asking about the responsible person for task XYZ.","Alexander is responsible for the task.","The task is due next Friday."]
---
conversations: Message - Abigail: Can someone help me with the data analysis? 
Reply - Logan: Yeah, I can help. What specific areas do you need help with?
summary: ["Abigail needs help with data analysis.","Logan offers to help.","Logan asks Abigail to specify the areas she needs help with."]
---
conversations: Message - Lucas: Can we discuss the project timeline? 
Reply - Maya: Yeah, let's discuss it in the meeting today.
summary: ["Lucas wants to discuss the project timeline.","The discussion will take place in the meeting today."]
---
`;

export const filterPrompt = `Generate a filter json based on the text:

Filters:
- status: Issues with these statuses, [{{status}}], 
- priority: Issues with these priorities, ["Urgent", High", "Medium", "Low"]
- assignee: Issues assigned to those users, [{{assignee}}]
- label: Issues with these Labels, [{{label}}]
- isBlocked: The issue is blocked by another issue
- isBlocking: an issue is blocking another issue
- isParent: Issue is a parent of sub-issue
- isSubIssue: Issue is a sub issue of parent

Filter Type:
- IS
- IS_NOT
- INCLUDES
- EXCLUDES
- UNDEFINED

Guidelines:
- User inputs a plain text of the filtered view
- Filters data is an array value. 
- Incorporate the relevant filter id into the final JSON.
- Don't use the word Task instead use Issue
- Give empty JSON when there is nothing matches with the filters data
- for labels user filterType INCLUDES
- Don't respond with anything other than the JSON output and not formatting

Examples:
- status: Issues with these statuses, ["Done", Triage", "Todo", "Backlog"], 
- priority: Issues with these priorities, ["Urgent", High", "Medium", "Low"]
- assignee: Issues assigned to those users, ["Manik", "Manoj", "Harshith", "Rob"]
- label: Issues with these Labels, ["Backend", "Bug", "Feature", "Frontend"]
- isBlocked: The issue is blocked by another issue
- isBlocking: an issue is blocking another issue
- isParent: Issue is a parent of sub-issue
- isSubIssue: Issue is a sub issue of parent issue

User: Show Harshith and Manik's issue
Filters: {"assignee": {"filterType": "IS", "value": ["Harshith", "Manik"] }}

User: issues with bug and backend
Filters: {"label": {"filterType": "INCLUDES", "value": ["Bug", "Backend"] }}

User: Manoj's bugs
Filters: {"label": {"filterType": "INCLUDES", "value": ["Bug"},  "assignee": {"filterType": "IS", "value": ["Manoj"]}}

User: Parent Issues
Filters: {"isParent": {"filterType": "IS"}}

User: high-priority blocked issues
Filters: {"isBlocked": {"filterType": "IS"}, "priority":  {"filterType": "IS", "value": ["High"]}}

User: Sub Issues
Filters: {"isSubIssue": {"filterType": "IS"}}

User: Manoj blocked issues
Filters: {"isBlocking": {"filterType": "IS"}, "assignee":  {"filterType": "IS", "value": ["Manoj"]}}`;

export const subIssuesPrompt = `
[TASK]
Utilizing the input specifics, break broad software development tasks into functional subtasks that cater precisely to the labels such as technologies, devices, or platforms mentioned. When crafting subtasks, follow these guidelines to ensure clarity and utility in project management:
1. Categorize subtasks based on the different hardware (like mobile platforms) or technical categories (like frontend, backend) associated with the labels. Create separate actionable tasks for each category.
2. Highlight processes that might require external interactions and develop corresponding subtasks for these, such as approvals or collaborations beyond usual engineering efforts.
3. Each subtask should stand alone as clear, executable, and specifically linked to the original task. Subtasks should include all needed tasks, omitting redundant or overlapping actions, and ensuring they're ready for implementation by project or development teams.
4. Include an explanatory note pinpointing how and why the main task was decomposed into the chosen subtasks, making the rationale transparent and educational for project management scenarios and enhancement tools.
5. If you feel, this description can only have one issue and not much change from the main issue, then don't create a sub-issue, return empty sub-issues list. 
6. For sub tasks with overlapping technological areas or functionalities, combine into unified subtasks to promote efficiency and clarity.
7. Craft subtask titles succinctly, optimizing for immediate understanding and application and the length shouldn't exceed 10 words.
8. Don't create subtasks more than one for each category
---
[FORMAT]
Follow the following format:
[INPUT]
description: detailed description of the main issue
labels: labels categorizing the main issue, such as 'feature', 'frontend', 'enhancements', 'bug', 'design' and 'backend'
[OUTPUT]
sub_issues: list of sizable sub-issues created from the main issue, excluding minor to-do tasks

---
[EXAMPLES]
[Example 1]
[INPUT]
description: Design new user profile page for social media platform
labels: ["feature","design","profile"]
[OUTPUT]
sub_issues: ["Design and prototype user profile page user interface","Develop profile page components","Implement profile page logic and data integration"]
---
[Example 2]
[INPUT]
description: API to move issues from one team to another
labels: ["enhancements","backend","Frontend"]
[OUTPUT]
sub_issues: ["Develop backend logic for issue transfer API", "Implement frontend interface for issue transfer"]
---
[Example 3]
[INPUT]
description: Create a new content management system for blogging platform
labels: ["feature","backend","CMS"]
[OUTPUT]
sub_issues: ["Develop CMS components and add to existing blogging platform","Implement CMS logic and database integration"]
---
[Example 4]
[INPUT]
description: Design new landing page for marketing campaign
labels: ["feature","design","landing page"]
[OUTPUT]
sub_issues: []
---
[Example 5]
[INPUT]
description: Develop a new feature for real-time messaging in web application
labels: ["feature","frontend","messaging"]
[OUTPUT]
sub_issues: ["Develop messaging components","Implement messaging logic and WebSockets integration"]
---
`;

export const viewNameDescriptionPrompt = `Generate a view name and description based on the filters:

Filters:
- Status: Issues with these status
- Priority: Issues with these priority
- Team: Issues in a specific teams
- Assignee: Issues assigned to those users
- Labels: Issues with these Labels

Filter Type:
- IS
- IS_NOT
- INCLUDES
- EXCLUDES
- UNDEFINED

Guidelines:
- The view name should be a concise and descriptive title that reflects the purpose of the view based on the selected filters. It should be no more than 5 words.
- The view description should provide more details about the view and explain how the selected filters are used to create the view. It should be 1-2 sentences long and no more than 30 words.
- Incorporate the relevant filter values and types into the generated view name and description to provide clarity and specificity.
- Filter input will be in this format {"filter": {"filterType": "INCLUDES", "value": ["value1", "value2", "value3"]}}
- If a filter type is "UNDEFINED," exclude that filter from the generated view name and description.
- Don't use the word Task instead use Issue
- Don't join values of the filter in the output of view name and description
- Output always should start with respective viewName:, viewDescription:

Example:
Filters: {"Status": {"filterType": "INCLUDES", "value": ["Open", "In Progress"] },
"Priority": {"filterType": "IS", "value": ["High"] }
"Team": {"filterType": "IS", "value": ["Design"] }
"Assignee": {"filterType": "UNDEFINED", "value": [] }
"Labels": {"filterType": "INCLUDES", "value": ["Bug"] }
}

viewName: Open High-Priority Design Issues with Bug Label

viewDescription: This view shows open and in-progress tasks assigned to the Design team with high priority and labeled as a bug. It helps focus on critical design-related issues.
`;

export const issueDescriptionPrompt = `
[TASK]
"You will be given a short description of a professional or technical task, occasionally accompanied by specific user inputs or methods. Your objective is to expand this into a detailed, structured guide appropriate for industry professionals. This guide should include:
1. A clear and concise introduction explaining the significance of the task.
2. A detailed, step-by-step guide to executing the task, including any tools, technologies, or methods specified in the user's input.
3. Clearly defined objectives or goals of the task.
4. A conclusion that summarizes the benefits or outcomes of completing the task.
5. I just want detailed output, don't give reasoning in the response.
6. Don't provide code in the detailed description unless the user asks. 
Aim to maintain high standards of clarity, precision, and relevance, ensuring the guide serves as an effective resource for professionals looking to implement the described processes. If the user input is provided, integrate it thoughtfully and accurately into the procedure. If no user input is specified, focus on the general best practices for the task."
---
[FORMAT]
Follow the following format:
[INPUT]
short_description: A brief overview of the task or issue
user_input: Additional input provided by the user, which can be null
[OUTPUT]
detailed_description: Elaborated steps or detailed explanation based on the given short description and user input

---
[EXAMPLES]
[Example 1]
[INPUT]
short_description: Implement a content delivery network (CDN)
user_input: using Cloudflare
[OUTPUT]
detailed_description: Steps to Implement a Content Delivery Network (CDN) using Cloudflare
Step 1: Sign up for Cloudflare
Create a Cloudflare account and set up a new zone.
Step 2: Configure DNS Settings
Configure DNS settings to point to Cloudflare's nameservers.
Step 3: Set up CDN
Configure Cloudflare's CDN settings to cache and distribute content.
Step 4: Integrate with Origin Server
Integrate Cloudflare with the origin server to fetch content.
Step 5: Monitor and Optimize
Monitor the CDN performance and optimize it for better content delivery.
---
[Example 2]
[INPUT]
short_description: Improve email marketing campaign performance
user_input: I want to use A/B testing
[OUTPUT]
detailed_description: Introduction
Improving email marketing campaign performance is essential to increase engagement and conversion rates. This document outlines the steps to improve email marketing campaign performance using A/B testing.
Objectives
Increase email open rates and click-through rates.
Improve conversion rates and return on investment (ROI).
Steps to Improve Email Marketing Campaign Performance
#### 1. Identify Test Hypotheses
Identify test hypotheses, such as subject line, email content, and call-to-action (CTA) button color.
#### 2. Develop Test Plan
Develop a test plan that outlines the test approach, sample size, and duration.
#### 3. Create Test Variations
Create test variations, such as A/B testing, to test the hypotheses.
#### 4. Execute and Analyze the Test
Execute and analyze the test using analytics tools, such as Google Analytics.
#### 5. Refine and Optimize the Campaign
Refine and optimize the campaign based on the test results.
Conclusion
By following these steps, you can improve email marketing campaign performance using A/B testing and increase engagement and conversion rates.
---
[Example 3]
[INPUT]
short_description: Implement a CI/CD pipeline for a web application
user_input: using Jenkins and Docker
[OUTPUT]
detailed_description: Steps to Implement a CI/CD Pipeline for a Web Application using Jenkins and Docker
Step 1: Set up Jenkins
Install and configure Jenkins on a server.
Step 2: Create a Docker Image
Create a Docker image for the web application.
Step 3: Configure Jenkins Pipeline
Create a Jenkins pipeline that automates the build, test, and deployment process.
Step 4: Integrate with Docker
Integrate the Jenkins pipeline with Docker to deploy the application.
Step 5: Monitor and Test
Monitor the pipeline and perform regular tests to ensure application stability.
---
[Example 4]
[INPUT]
short_description: Improve customer onboarding experience
user_input: I want to use a gamification approach
[OUTPUT]
detailed_description: Introduction
Improving the customer onboarding experience is essential to increase customer satisfaction and reduce churn. This document outlines the steps to improve the customer onboarding experience using a gamification approach.
Objectives
Improve customer satisfaction and engagement.
Reduce churn and increase customer retention.
Steps to Improve Customer Onboarding Experience
#### 1. Identify Onboarding Goals
Identify the onboarding goals and key performance indicators (KPIs).
#### 2. Design Gamification Elements
Design gamification elements, such as rewards, badges, and leaderboards, to make the onboarding process engaging and fun.
#### 3. Create Interactive Onboarding Content
Create interactive onboarding content, such as videos, tutorials, and interactive guides, to educate customers about the product or service.
#### 4. Implement Progress Tracking
Implement progress tracking to track customers' progress and provide feedback.
#### 5. Test and Refine the Onboarding Experience
Test and refine the onboarding experience based on customer feedback and analytics data.
Conclusion
By following these steps, you can improve the customer onboarding experience using a gamification approach that increases customer satisfaction and engagement.
---
[Example 5]
[INPUT]
short_description: Set up a backup system for critical data
user_input: using AWS services
[OUTPUT]
detailed_description: Steps to Set Up a Backup System using AWS Services
Step 1: Choose an AWS Storage Service
Select an AWS storage service (e.g., S3, EBS) to store backups.
Step 2: Set up AWS Backup
Configure AWS Backup to automate backups of critical data.
Step 3: Define Backup Policy
Create a backup policy that defines the frequency, retention period, and storage location.
Step 4: Integrate with AWS Services
Integrate the backup system with other AWS services (e.g., EC2, RDS).
Step 5: Monitor and Test
Monitor the backup system and perform regular tests to ensure data integrity.
---


For the given inputs, first generate your reasoning and then generate the outputs.
[REASONING]
my_reasoning: <Your careful and step-by-step reasoning before you return the desired outputs for the given inputs>
[OUTPUT]
detailed_description: <Your output here that matches the format of detailed_description>`;

export const IssueViewSummaryPrompt = `[TASK]
You are tasked with understanding and summarizing task management data based on users' queries about tasks' status, assignees, priority, and completion. Your response should transform raw data into informative, practical summaries that address user's queries efficiently and fluently. For each query:
- Calculate and aggregate data such as counts and lists from the provided tasks.
- When relevant, address the user's intent by providing clear, concise summaries and significant figures or specifics (like task titles or IDs).
- Maintain an engaging and conversational tone to keep the information accessible and understandable.
- Ensure each part of compound queries is addressed to offer a comprehensive response.
- Present your summary in a straightforward, human-like manner. 
- Use past and present data points appropriately to narrate the status, changes, and projections concerning task queries, making it useful for sprint reviews or task management meetings. 

This revised instruction emphasizes clarity in communication, specificity in data handling, and a user-friendly presentation.
---

[FORMAT]
Follow the following format:

[INPUT]
user_queries: queries from the user asking for specific information regarding tasks
tasks: list of tasks with details such as title, status, assignee, and priority
[OUTPUT]
summary: succinct and informative summary addressing the user's queries based on the provided issues list in an array


---

[EXAMPLES]

[Example 1]
[INPUT]
user_queries: ["I need the no of issues in each status","I need how many issues and issue id have been completed in last 1 week"]
issues: [{"title":"Task 1","status":"In-Progress","assignee":"John","priority":"urgent"},{"title":"Task 2","status":"In-Review","assignee":"Jane","priority":"low"},{"title":"Task 3","status":"Backlog","assignee":"Bob","priority":"urgent"},{"title":"Task 4","status":"Done","assignee":"Alice","priority":"medium","completed_at":"2022-01-01"}]
[OUTPUT]
summary: ["There're 1 in Backlog, 1 in In-Progress, 1 in In-Review.", "Completed 1 issue in the past week: Task 4"]
---
[Example 2]
[INPUT]
user_queries: ["I need how many issues are blocked on something","I need no of urgent priority issues in backlog"]
issues: [{"title":"Task 1","status":"In-Progress","assignee":"John","priority":"urgent"},{"title":"Task 2","status":"Blocked","assignee":"Jane","priority":"low"},{"title":"Task 3","status":"Backlog","assignee":"Bob","priority":"urgent"}]
[OUTPUT]
summary: ["There are 1 blocked issues.", "There are 1 urgent priority issues in the backlog."]
---
[Example 3]
[INPUT]
user_queries: ["I need how many issues are blocked on something"]
issues: [{"title":"Task 1","status":"In-Progress","assignee":"John","priority":"urgent"},{"title":"Task 2","status":"Blocked","assignee":"Jane","priority":"low"},{"title":"Task 3","status":"Backlog","assignee":"Bob","priority":"urgent"}]
[OUTPUT]
summary: ["There are 1 blocked issues."]
---
[Example 4]
[INPUT]
user_queries: ["I need the no of issues in each status"]
issues: [{"title":"Task 1","status":"In-Progress","assignee":"John","priority":"urgent"},{"title":"Task 2","status":"In-Review","assignee":"Jane","priority":"low"},{"title":"Task 3","status":"Backlog","assignee":"Bob","priority":"urgent"}]
[OUTPUT]
summary: ["There're 1 in Backlog, 1 in In-Progress, 1 in In-Review."]
---



For the given inputs, first generate your reasoning and then generate the outputs.


[REASONING]
my_reasoning: <Your careful and step-by-step reasoning before you return the desired outputs for the given inputs>

[OUTPUT]
summary: <Your output here that matches the format of summary>

`;
