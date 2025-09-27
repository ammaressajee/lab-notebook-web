import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatDividerModule, MatIconModule, MatListModule, MatInputModule, MatSelectModule, MatCardModule, MatButtonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {

  projects: any[] = [];
  newProject = { name: '', description: '' };

  constructor(private api: ApiService, private router: Router, private snackBar: MatSnackBar) {}

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
  if(!this.newProject.name) return;

  this.api.createProject(this.newProject).subscribe(res => {
    this.projects.push(res);
    this.snackBar.open('Project created!', 'Close', { duration: 2000 });
    this.newProject = { name: '', description: '' };
  });
  }
}
