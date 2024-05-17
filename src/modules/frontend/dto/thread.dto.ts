import { CommentDto } from '@backend/dto/comment';
import { OmittedPostsDto } from '@frontend/dto/omitted-posts.dto';

export class ThreadDto {
  openingPost: CommentDto;

  omittedPosts?: OmittedPostsDto;

  replies: CommentDto[];

  constructor(openingPost: CommentDto, replies: CommentDto[], omittedPosts?: OmittedPostsDto) {
    this.openingPost = openingPost;
    this.replies = replies;

    if (omittedPosts) {
      this.omittedPosts = omittedPosts;
    }
  }
}
