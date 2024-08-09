-- CreateTable
CREATE TABLE "IntegrationDefinitionV2" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "IntegrationDefinitionV2_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationDefinitionV2_name_key" ON "IntegrationDefinitionV2"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationAccount_accountId_integrationDefinitionId_worksp_key" ON "IntegrationAccount"("accountId", "integrationDefinitionId", "workspaceId");

-- AddForeignKey
ALTER TABLE "IntegrationDefinitionV2" ADD CONSTRAINT "IntegrationDefinitionV2_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_integratedById_fkey" FOREIGN KEY ("integratedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_integrationDefinitionId_fkey" FOREIGN KEY ("integrationDefinitionId") REFERENCES "IntegrationDefinitionV2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationAccount" ADD CONSTRAINT "IntegrationAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
