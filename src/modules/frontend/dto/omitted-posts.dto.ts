export class OmittedPostsDto {
  comments: number;

  files: number;

  needToDisplay: boolean;

  constructor(comments: number, files: number, needToDisplay: boolean) {
    this.comments = comments;
    this.files = files;
    this.needToDisplay = needToDisplay;
  }
}
