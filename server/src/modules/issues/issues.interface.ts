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
