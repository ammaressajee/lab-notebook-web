export interface ExperimentType {
  id: string;
  name: string;
  fields: { name: string; type: string; options?: string[] }[];
  defaultData?: { [key: string]: any }; // NEW
}
