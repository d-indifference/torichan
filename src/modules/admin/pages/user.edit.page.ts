import { SessionPayloadDto } from '@admin/dto';
import { UserDto } from '@backend/dto/user';

export enum UserEditPageFormMode {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  ME = 'ME'
}

export class UserEditPageArgs {
  formDescription: string;

  formBackAddress: string;

  formHandler: string;

  formMode: UserEditPageFormMode;

  formData: UserDto;

  formSubmit: string;
}

export class UserEditPage {
  session: SessionPayloadDto;

  args: UserEditPageArgs;
}
