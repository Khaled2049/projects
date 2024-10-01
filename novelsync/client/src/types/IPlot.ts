export interface PlotEvent {
  id: string;
  name: string;
  content: string;
}

export interface PlotLine {
  id: string;
  name: string;
  description: string;
  events: PlotEvent[];
}
