interface EmailTemplateProps {
  workspaceName: string;
  issueNumber: string;
  issueTitle: string;
  message: string;
  workspaceSlug: string;
  assigneeAvatar?: string;
}

export const generateEmailTemplate = ({
  workspaceName,
  issueNumber,
  issueTitle,
  message,
  workspaceSlug,
  assigneeAvatar,
}: EmailTemplateProps): string => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.5;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          text-align: left;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
        .logo {
          width: 40px;
          height: 40px;
          margin-bottom: 20px;
        }
        .notification-text {
          font-size: 16px;
          margin-bottom: 24px;
        }
        .workspace-name {
          background-color: #FFF7E6;
          color: #B76E00;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
        }
        .issue-line {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .issue-number {
          color: #666;
          font-size: 14px;
          margin-right: 4px;
        }
        .issue-title {
          font-size: 14px;
          color: #333;
          margin-left: 0;
        }
        .assignee-info {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .assignee-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .action-button {
          display: inline-block;
          background-color: #1A89C5;
          color: white !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 6px;
          margin-top: 20px;
          font-size: 14px;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .footer a {
          color: #666;
          text-decoration: none;
        }
        .unsubscribe {
          color: #999;
          text-decoration: none;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://app.tegon.ai/logo.png" alt="Logo" class="logo">
        
        <div class="notification-text">
          You have got a notification on ${workspaceName}
        </div>
  
        <div class="issue-details">
          <div class="issue-line">
            <div class="issue-number">
              ${issueNumber}
            </div>
            <div class="issue-title">
              ${issueTitle}
            </div>
          </div>
          <div class="assignee-info">
            ${assigneeAvatar ? `<img src="${assigneeAvatar}" alt="" class="assignee-avatar">` : ''}
            ${message}
          </div>
        </div>
  
        <a href="https://app.tegon.ai/${workspaceSlug}/inbox" class="action-button">
          Open Your Inbox
        </a>
  
        <div class="footer">
          <a href="https://app.tegon.ai" class="unsubscribe">
            Tegon
          </a>
        </div>
      </div>
    </body>
  </html>
    `.trim();
};
