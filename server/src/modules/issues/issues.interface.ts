/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  IsArray,
  IsDate,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TeamRequestParams {
  @IsString()
  teamId: string;
}

export class IssueRequestParams {
  @IsString()
  issueId: string;
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
  sortOrder: number;

  @IsOptional()
  @IsNumber()
  estimate: number;

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

  @IsArray()
  subscriberIds: string[];
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
  estimate: number;

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
  @IsArray()
  subscriberIds: string[];
}

export class LinkIssueData {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString()
  sourceId: string;

  @IsOptional()
  @IsJSON()
  source?: Record<string, string | number>;

  @IsOptional()
  @IsJSON()
  sourceData?: Record<string, string | number>;
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
