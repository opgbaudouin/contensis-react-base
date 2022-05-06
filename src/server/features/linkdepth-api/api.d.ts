export type LinkDepthApiFilter = {
  [key: string]: any;
  fieldId: string;
  fieldOperator?: string;
  logicOperator?: string;
};

export type LinkDepthApiFilters = {
  [paramKey: string]: string | LinkDepthApiFilter;
};

export type LinkFieldConfig = {
  contentTypeId?: string;
  filters?: LinkDepthApiFilters;
  sharedFilters?: LinkDepthApiFilters;
  linkFields?: LinkFields;
};

export type LinkFields = {
  [fieldId: string]: LinkFieldConfig;
};

export type LinkDepthApiConfig = {
  uri: string;
  contentTypeId: string;
  filters?: LinkDepthApiFilters;
  sharedFilters?: LinkDepthApiFilters;
  linkFields: LinkFields;
};

export type QueryConfigAtLevel = {
  contentTypeIds: string;
  fieldId?: string;
  filters?: LinkDepthApiFilters;
  sharedFilters?: LinkDepthApiFilters;
};

export type LinkDepthHierarchy = {
  [level: number]: QueryConfigAtLevel[];
};
