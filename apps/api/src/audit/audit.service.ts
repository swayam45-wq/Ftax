import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface AuditLogEntry {
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const data: Prisma.AuditLogUncheckedCreateInput = {
        action: entry.action,
        userId: entry.userId,
        resource: entry.resource,
        resourceId: entry.resourceId,
        metadata: entry.metadata as Prisma.InputJsonValue,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      };
      await this.prisma.auditLog.create({ data });
    } catch (error) {
      // Audit failures should never crash the app
      this.logger.error('Failed to write audit log', error);
    }
  }
}
