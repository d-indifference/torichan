export class PackageJsonDto {
  name: string;

  version: string;

  description: string;

  author: string;

  private: boolean;

  license: string;

  scripts: Record<string, string>;

  dependencies: Record<string, string>;

  devDependencies: Record<string, string>;
}
