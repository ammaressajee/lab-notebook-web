import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {

  projects: any[] = [];
  newProject = { name: '', description: '' };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getProjects().subscribe(res => this.projects = res);
  }

  openProject(project: any) {
    this.router.navigate(['/projects', project.id]);
  }

  create() {
    this.api.createProject(this.newProject).subscribe(() => {
      this.newProject = { name: '', description: '' };
      this.load();
    });
  }
}
