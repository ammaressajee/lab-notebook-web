import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

interface Experiment {
  id: number;
  title: string;
  date: string;
  tags: string;
  method: string;
  observations: string;
  results: string;
  conclusion: string;
  llm_text?: string;
  llm_response?: string; 
}

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./view-data.component.scss'],
})
export class ViewDataComponent implements OnInit {
  experiments: Experiment[] = [];
  searchTag = '';
  searchText = '';
  expandedExpId: number | null = null;
  loadingExpId: number | null = null; 

  toggleExpand(expId: number) {
    if (this.expandedExpId === expId) {
      this.expandedExpId = null; // collapse if already expanded
    } else {
      this.expandedExpId = expId; // expand the clicked one
    }
  }

  ngOnInit() {
    this.loadExperiments();
  }

  async loadExperiments() {
    try {
      const params: any = {};
      if (this.searchTag) params.tag = this.searchTag;
      if (this.searchText) params.search = this.searchText;

      const res = await axios.get('http://127.0.0.1:8000/experiments', { params });
      this.experiments = res.data;
    } catch (err: any) {
      console.error(err);
      alert('Failed to fetch experiments.');
    }
  }
  clearSearch() {
    this.searchText = '';
    this.loadExperiments();
  }

  async filter() {
    await this.loadExperiments();
  }

  async analyzeExperiment(exp: Experiment) {
  if (!exp.llm_text) {
    alert('No LLM text available for this experiment.');
    return;
  }

  try {
    this.loadingExpId = exp.id;

    const res = await axios.post('http://127.0.0.1:8000/analyze', {
      llm_text: exp.llm_text,
    });
    console.log(res.data.analysis);

    // Corrected property
    exp.llm_response = res.data.analysis;
  } catch (err: any) {
    console.error(err);
    alert('Failed to analyze experiment.');
  } finally {
    this.loadingExpId = null;
  }
}

}
