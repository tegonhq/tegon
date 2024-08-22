export enum LLMMappings {
  GPT35TURBO = 'gpt-3.5-turbo',
  GPT4TURBO = 'gpt-4-turbo',
  LLAMA3 = 'llama3',
  CLAUDEOPUS = 'opus',
  GPT4O = 'gpt-4o',
}

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
summary: ["There're 1 in Backlog, 1 in In-Progress, 1 in In-Review.", "Completed 1 issue in the past week"]
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
