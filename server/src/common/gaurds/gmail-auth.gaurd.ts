import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { getRequest } from "modules/integrations/integrations.utils";

@Injectable()
export class GmailAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Add your custom authentication logic for Gmail here
    // For example, check for a specific header or token
    const authHeader = request.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const tokenResponse = await getRequest(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
        { headers: {} },
      );

      if (tokenResponse.data.email === process.env.GMAIL_WEBHOOK_SECRET) {
        return true;
      }
    }
    return false;
  }
}
