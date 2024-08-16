# Tegon Integration Guide

## Introduction

Welcome to the Tegon integration development guide! This guide will walk you through the steps to create a new integration for Tegon.

## Prerequisites

Before you begin, ensure you have the following installed:

- [pnpm](https://pnpm.io/installation)

## Step 1: Set Up Your Environment

1. Navigate to the `/app/integrations` folder in your Tegon project:
   ```bash
   cd /app/integrations
   ```
2. Install the necessary dependencies:
   ```bash
   pnpm install
   ```

## Step 2: Generate Integration Files

1. Generate the necessary files by running the following command inside the newly created folder:
   ```bash
   pnpm generate
   ```
2. When prompted, specify the integration name. This will generate the required `handler.ts` and `spec.ts` files for your integration.

## Step 3: Implement Your Integration

Tegon integrations are built on top of a unified event handler that processes different event types within a single function. The core of your integration lies in how you handle these event types.

### Handling Events

The `run` function is the main entry point for processing events related to your integration. The event payload will contain a type that determines what action your integration needs to take. Here’s a breakdown of how to handle each event type:

- **IntegrationSpec:** When this event is received, your handler should return a specification JSON that defines your integration's capabilities, required authentication details, and configuration options.
- **IntegrationCreate:** This event is triggered when a user provides authentication details within Tegon. Your handler should process the user's input and handle the creation of the integration, such as saving settings data and establishing necessary connections.
- **IntegrationDelete:** This event is triggered when a user deletes the integration account.

### Example Code

Here’s a sample structure of the `run` function:

```typescript
async function run(eventPayload: IntegrationEventPayload) {
  switch (eventPayload.event) {
    case IntegrationPayloadEventType.IntegrationSpec:
      return spec();

    case IntegrationPayloadEventType.IntegrationCreate:
      return await integrationCreate(
        eventPayload.payload.userId,
        eventPayload.payload.workspaceId,
        eventPayload.payload.data,
      );

    default:
      return {
        message: `The event payload type is ${eventPayload.event}`,
      };
  }
}
```

### Implementation Steps

1. Open the generated `handler.ts` and `spec.ts` files.
2. Follow the provided TODOs within these files to complete the integration logic.

Questions, comments, or concerns? Let us know in our [github](https://github.com/tegonhq/tegon/issues)
