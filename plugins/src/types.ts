export type FileInfo = {
  srcPath: string;
  filePath: string;
  methodTypes: string[];
  importPath: string;
  apiPath: string;
  variableName: string;
};

export type Config = {
  appDir: string;
  distDir: string;
  baseDir: string;
  moduleNameSpace: string;
};
