import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-submit-data',
  imports: [FormsModule, CommonModule, QuillModule],
  templateUrl: './submit-data.component.html',
  styleUrl: './submit-data.component.scss'
})
export class SubmitDataComponent {
  title = '';
  date = '';
  tags = '';
  method = '';
  observations = '';
  results = '';
  conclusion = '';
  files: File[] = [];

  onFileChange(event: any) {
    this.files = Array.from(event.target.files);
  }

  async submit() {
    try {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('date', this.date);
      formData.append('tags', this.tags);
      formData.append('method', this.method);
      formData.append('observations', this.observations);
      formData.append('results', this.results);
      formData.append('conclusion', this.conclusion);

      await axios.post('http://localhost:8000/experiment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Experiment saved!");

      // reset fields
      this.title = '';
      this.date = '';
      this.tags = '';
      this.method = '';
      this.observations = '';
      this.results = '';
      this.conclusion = '';

    } catch (err: any) {
      console.error(err);
      alert("Failed to save experiment. Check console.");
    }
  }
}