import { SessionPayloadDto } from '@admin/dto';

export enum EditPageFormArgsMode {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE'
}

export class EditPageFormArgs<T> {
  formDescription: string;

  formHandler: string;

  formMode: EditPageFormArgsMode;

  formData?: T;
}

export class EditPage<T> {
  session: SessionPayloadDto;

  args: EditPageFormArgs<T>;
}
