import * as os from 'os';

export class TechnicalInfoDto {
  diskSpaceUsed: string;

  totalComments: number;

  totalBoards: number;

  uptime: number;

  cpus: os.CpuInfo[];

  memory: {
    total: string;
    inUsage: string;
    free: string;
  };

  port: number;

  debugPort: number;

  host: string;

  processVersions: Record<string, string>;

  postgresVersion: string;

  dependencies: Record<string, string>;

  devDependencies: Record<string, string>;
}
