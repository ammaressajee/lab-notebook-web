import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  // Projects
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects`);
  }
  createProject(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/projects`, data);
  }

  // Experiment Types
  getExperimentTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/experiment_types`);
  }
  createExperimentType(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/experiment_types`, data);
  }
  getExperimentTypeFields(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/experiment_types/${id}/fields`);
  }

  // Experiments
  getExperiments(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/${projectId}/experiments`);
  }
  createExperiment(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/projects/${data.project_id}/experiments`,
      data
    );
  }

}
