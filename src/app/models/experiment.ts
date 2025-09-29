export interface Experiment {
  id: number;
  project_id: number;
  experiment_type_name: string;
  data: Record<string, any>;
  notes?: string;
  start_date?: string;
  end_date?: string;
  moving_forward?: string;
  conclusions?: string;
  selected?: boolean;
  expanded?: boolean;
}
