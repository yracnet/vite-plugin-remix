import delegate, { FormatInputPathObject, ParsedPath } from "path";

export const slash = (str = "") => {
  return str.replace(/\\/g, "/");
};
export const normalize = (path: string): string => {
  return slash(delegate.normalize(path));
};
export const join = (...paths: string[]): string => {
  return slash(delegate.join(...paths));
};
export const resolve = (...paths: string[]): string => {
  return slash(delegate.resolve(...paths));
};
export const isAbsolute = (path: string): boolean => {
  path = slash(path);
  return delegate.isAbsolute(path);
};
export const relative = (from: string, to: string): string => {
  return slash(delegate.relative(from, to));
};
export const dirname = (path: string): string => {
  return slash(delegate.dirname(path));
};
export const basename = (path: string, suffix?: string): string => {
  return slash(delegate.basename(path, suffix));
};
export const extname = (path: string): string => {
  return slash(delegate.extname(path));
};
export const parse = (path: string): ParsedPath => {
  let data = delegate.parse(path);
  data.root = slash(data.root);
  data.dir = slash(data.dir);
  data.base = slash(data.base);
  data.ext = slash(data.ext);
  data.name = slash(data.name);
  return data;
};
export const format = (pathObject: FormatInputPathObject): string => {
  return slash(delegate.format(pathObject));
};
export const toNamespacedPath = (path: string): string => {
  return slash(delegate.toNamespacedPath(path));
};

export default {
  slash,
  normalize,
  join,
  resolve,
  isAbsolute,
  relative,
  dirname,
  basename,
  extname,
  parse,
  format,
  toNamespacedPath,
};
