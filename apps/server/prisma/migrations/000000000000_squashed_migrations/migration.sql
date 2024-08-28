-- CreateEnum
CREATE TYPE "Preference" AS ENUM ('ISSUE_ESTIMATES', 'PRIORITIES');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'BOT', 'AGENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('DEPLOYING', 'ERRORED', 'INSTALLED', 'NEEDS_CONFIGURATION', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ModelName" AS ENUM ('Action', 'ActionEntity', 'Attachment', 'AIRequest', 'Emoji', 'IntegrationAccount', 'IntegrationDefinition', 'IntegrationDefinitionV2', 'Invite', 'Issue', 'IssueComment', 'IssueHistory', 'IssueRelation', 'IssueSuggestion', 'Label', 'LinkedComment', 'LinkedIssue', 'Notification', 'Prompt', 'Reaction', 'SyncAction', 'Team', 'TeamPreference', 'Template', 'TriggerProject', 'User', 'UsersOnWorkspaces', 'View', 'Workflow', 'Workspace', 'WorkspaceTriggerProject');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('I', 'U', 'D');

-- CreateEnum
CREATE TYPE "WorkflowCategory" AS ENUM ('TRIAGE', 'BACKLOG', 'UNSTARTED', 'STARTED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('ISSUE', 'PROJECT', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "IssueRelationType" AS ENUM ('BLOCKS', 'BLOCKED', 'RELATED', 'DUPLICATE', 'DUPLICATE_OF', 'SIMILAR');

-- CreateEnum
CREATE TYPE "NotificationActionType" AS ENUM ('IssueAssigned', 'IssueUnAssigned', 'IssueStatusChanged', 'IssuePriorityChanged', 'IssueNewComment', 'IssueBlocks');

-- CreateEnum
CREATE TYPE "AttachmentStatus" AS ENUM ('Pending', 'Failed', 'Uploaded', 'Deleted', 'External');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "LLMModels" AS ENUM ('GPT35TURBO', 'GPT4TURBO', 'LLAMA3', 'CLAUDEOPUS', 'GPT4O');

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "integrations" TEXT[],
    "status" "ActionStatus" NOT NULL,
    "version" TEXT NOT NULL,
    "triggerVersion" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "data" JSONB,
    "cron" TEXT,
    "workspaceId" TEXT,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionEntity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,

    CONSTRAINT "ActionEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "eventType" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "eventData" JSONB,
    "sequenceId" BIGINT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "processedIds" TEXT[],
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "ActionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "fileName" TEXT,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileExt" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT,
    "status" "AttachmentStatus" NOT NULL,
    "sourceMetadata" JSONB,
    "uploadedById" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "modelName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "response" TEXT,
    "llmModel" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AIRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emoji" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Emoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationAccount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "integrationConfiguration" JSONB NOT NULL,
    "accountId" TEXT,
    "settings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "personal" BOOLEAN NOT NULL DEFAULT false,
    "integratedById" TEXT NOT NULL,
    "integrationDefinitionId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "IntegrationAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationDefinitionV2" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "IntegrationDefinitionV2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "emailId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL,
    "teamIds" TEXT[],
    "role" "Role" NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "description" TEXT,
    "priority" INTEGER,
    "dueDate" TIMESTAMP(3),
    "sortOrder" INTEGER,
    "subIssueSortOrder" INTEGER,
    "estimate" INTEGER,
    "sourceMetadata" JSONB,
    "isBidirectional" BOOLEAN,
    "teamId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "subscriberIds" TEXT[],
    "assigneeId" TEXT,
    "labelIds" TEXT[],
    "stateId" TEXT NOT NULL,
    "parentId" TEXT,
    "attachments" TEXT[],
    "issueSuggestionId" TEXT,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "body" TEXT NOT NULL,
    "sourceMetadata" JSONB,
    "userId" TEXT,
    "updatedById" TEXT,
    "reactionsData" JSONB[],
    "issueId" TEXT NOT NULL,
    "parentId" TEXT,
    "attachments" TEXT[],

    CONSTRAINT "IssueComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "userId" TEXT,
    "issueId" TEXT NOT NULL,
    "sourceMetaData" JSONB,
    "addedLabelIds" TEXT[],
    "removedLabelIds" TEXT[],
    "fromPriority" INTEGER,
    "toPriority" INTEGER,
    "fromStateId" TEXT,
    "toStateId" TEXT,
    "fromEstimate" INTEGER,
    "toEstimate" INTEGER,
    "fromAssigneeId" TEXT,
    "toAssigneeId" TEXT,
    "fromParentId" TEXT,
    "toParentId" TEXT,
    "fromTeamId" TEXT,
    "toTeamId" TEXT,
    "relationChanges" JSONB,

    CONSTRAINT "IssueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueRelation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issueId" TEXT NOT NULL,
    "relatedIssueId" TEXT NOT NULL,
    "type" "IssueRelationType" NOT NULL,
    "metadata" JSONB,
    "createdById" TEXT,
    "deletedById" TEXT,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "IssueRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueSuggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "issueId" TEXT NOT NULL,
    "suggestedLabelIds" TEXT[],
    "suggestedAssigneeId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "IssueSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalAccessToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "jwt" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "PersonalAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "workspaceId" TEXT NOT NULL,
    "teamId" TEXT,
    "groupId" TEXT,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedComment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceData" JSONB,
    "createdById" TEXT,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "LinkedComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedIssue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "sourceId" TEXT,
    "sourceData" JSONB,
    "createdById" TEXT,
    "updatedById" TEXT,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "LinkedIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "type" "NotificationActionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "issueId" TEXT,
    "actionData" JSONB,
    "createdById" TEXT,
    "sourceMetadata" JSONB,
    "readAt" TIMESTAMP(3),
    "snoozedUntil" TIMESTAMP(3),
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" "LLMModels" NOT NULL DEFAULT 'GPT35TURBO',
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "reactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "emojiId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncAction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "modelName" "ModelName" NOT NULL,
    "modelId" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "sequenceId" BIGINT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "SyncAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "icon" TEXT,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPreference" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,
    "preference" "Preference" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TeamPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "templateData" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT,
    "username" TEXT NOT NULL,
    "initialSetupComplete" BOOLEAN NOT NULL DEFAULT false,
    "anonymousDataCollection" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnWorkspaces" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "teamIds" TEXT[],
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "externalAccountMappings" JSONB,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "joinedAt" TIMESTAMP(3),

    CONSTRAINT "UsersOnWorkspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "workspaceId" TEXT NOT NULL,
    "teamId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "category" "WorkflowCategory" NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "actionsEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionEntity_type_entity_actionId_key" ON "ActionEntity"("type", "entity", "actionId");

-- CreateIndex
CREATE UNIQUE INDEX "Emoji_name_key" ON "Emoji"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationAccount_accountId_integrationDefinitionId_worksp_key" ON "IntegrationAccount"("accountId", "integrationDefinitionId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationDefinitionV2_name_key" ON "IntegrationDefinitionV2"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_issueSuggestionId_key" ON "Issue"("issueSuggestionId");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_teamId_number_key" ON "Issue"("teamId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "IssueRelation_issueId_relatedIssueId_type_key" ON "IssueRelation"("issueId", "relatedIssueId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "IssueSuggestion_issueId_key" ON "IssueSuggestion"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAccessToken_name_userId_token_key" ON "PersonalAccessToken"("name", "userId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_workspaceId_key" ON "Label"("name", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedComment_url_key" ON "LinkedComment"("url");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedIssue_url_key" ON "LinkedIssue"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_name_workspaceId_key" ON "Prompt"("name", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_emojiId_commentId_userId_key" ON "Reaction"("emojiId", "commentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncAction_modelId_action_key" ON "SyncAction"("modelId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_identifier_workspaceId_key" ON "Team"("name", "identifier", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPreference_teamId_preference_key" ON "TeamPreference"("teamId", "preference");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnWorkspaces_userId_workspaceId_key" ON "UsersOnWorkspaces"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionEntity" ADD CONSTRAINT "ActionEntity_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionEvent" ADD CONSTRAINT "ActionEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRequest" ADD CONSTRAINT "AIRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_integratedById_fkey" FOREIGN KEY ("integratedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_integrationDefinitionId_fkey" FOREIGN KEY ("integrationDefinitionId") REFERENCES "IntegrationDefinitionV2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationDefinitionV2" ADD CONSTRAINT "IntegrationDefinitionV2_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_issueSuggestionId_fkey" FOREIGN KEY ("issueSuggestionId") REFERENCES "IssueSuggestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueComment" ADD CONSTRAINT "IssueComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "IssueComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueHistory" ADD CONSTRAINT "IssueHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueRelation" ADD CONSTRAINT "IssueRelation_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedComment" ADD CONSTRAINT "LinkedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "IssueComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedIssue" ADD CONSTRAINT "LinkedIssue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "IssueComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_emojiId_fkey" FOREIGN KEY ("emojiId") REFERENCES "Emoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncAction" ADD CONSTRAINT "SyncAction_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPreference" ADD CONSTRAINT "TeamPreference_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnWorkspaces" ADD CONSTRAINT "UsersOnWorkspaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnWorkspaces" ADD CONSTRAINT "UsersOnWorkspaces_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

