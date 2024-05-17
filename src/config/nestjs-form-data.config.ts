import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile, FormDataInterceptorConfig } from 'nestjs-form-data';
import * as path from 'path';

export const nestjsFormDataConfig = (config: ConfigService): FormDataInterceptorConfig => ({
  storage: FileSystemStoredFile,
  fileSystemStoragePath: path.join(process.cwd(), config.getOrThrow<string>('paths.files'))
});
