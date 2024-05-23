import { PipeTransform } from '@nestjs/common';
import { RemoveCommentDto, RemoveCommentRequestDto } from '@admin/dto';

export class ExtractCommentRemovePayloadPipe implements PipeTransform {
  transform(value: RemoveCommentRequestDto): RemoveCommentDto {
    return JSON.parse(value.payload) as RemoveCommentDto;
  }
}
