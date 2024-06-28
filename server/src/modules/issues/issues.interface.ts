/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Issue } from '@@generated/issue/entities';
import { Team, User } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { IssueRelationType } from 'modules/issue-relation/issue-relation.interface';
import { LinkedIssueSubType } from 'modules/linked-issue/linked-issue.interface';

export class TeamRequestParams {
  @IsString()
  teamId: string;
}

export class IssueRequestParams {
  @IsString()
  issueId: string;
}
export interface ApiResponse {
  status: number;
  message: string;
}

export class LinkIssueInput {
  @IsString()
  url: string;

  @IsOptional()
  @IsEnum(LinkedIssueSubType)
  type?: LinkedIssueSubType;

  @IsOptional()
  @IsString()
  title?: string;
}

export class WorkspaceQueryParams {
  @IsString()
  workspaceId: string;
}

export class RelationInput {
  @IsOptional()
  @IsEnum(IssueRelationType)
  type?: IssueRelationType;

  @IsOptional()
  @IsString()
  issueId?: string;

  @IsOptional()
  @IsString()
  relatedIssueId?: string;
}

export class CreateIssueInput {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsNumber()
  estimate?: number;

  @IsOptional()
  @IsNumber()
  subIssueSortOrder?: number;

  @IsOptional()
  @IsArray()
  labelIds?: string[];

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsString()
  stateId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  subscriberIds?: string[];

  @IsBoolean()
  isBidirectional: boolean;

  @IsOptional()
  @IsObject()
  linkIssue?: LinkIssueInput;

  @IsOptional()
  @IsObject()
  issueRelation?: RelationInput;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

export class UpdateIssueInput {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsNumber()
  subIssueSortOrder?: number;

  @IsOptional()
  @IsNumber()
  estimate?: number;

  @IsOptional()
  @IsArray()
  labelIds?: string[];

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  stateId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  isBidirectional?: boolean;

  @IsOptional()
  @IsArray()
  subscriberIds: string[];

  @IsOptional()
  @IsObject()
  issueRelation?: RelationInput;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

export interface IssueWithRelations extends Issue {
  team?: Team;
  createdBy?: User;
}

export enum IssueAction {
  CREATED,
  UPDATED,
}

export enum SubscribeType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export class SubscribeIssueInput {
  @IsEnum(SubscribeType)
  type: SubscribeType;
}

export class SuggestionsInput {
  @IsString()
  description: string;

  @IsString()
  workspaceId: string;
}

export class MoveIssueInput {
  @IsString()
  teamId: string;
}

export const titlePrompt = ` You have deep expertise in project management and task management for software teams. Whenever a text is provided to you, you have to create an issue title for software development tasks based on the description text.

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

export const labelPrompt = `Your Expertise: You have deep expertise in project management and are well versed with Agile methodology for software teams.

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

export const summarizePrompt = `[TASK]
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
