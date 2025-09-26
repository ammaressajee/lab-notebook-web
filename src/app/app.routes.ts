import { Routes } from '@angular/router';
import { SubmitDataComponent } from './pages/submit-data/submit-data.component';
import { ViewDataComponent } from './pages/view-data/view-data.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ExperimentFormComponent } from './pages/experiment-form/experiment-form.component';
import { ExperimentTypeListComponent } from './pages/experiment-type-list/experiment-type-list.component';
import { ExperimentTypeCreateComponent } from './pages/experiment-type-create/experiment-type-create.component';

export const routes: Routes = [
    { path: 'submit', component: SubmitDataComponent },
    { path: 'view', component: ViewDataComponent },
    { path: '', redirectTo: 'projects', pathMatch: 'full' },
    { path: 'projects', component: ProjectListComponent },
    { path: 'projects/:id', component: ProjectDetailComponent },
    { path: 'experiment-types', component: ExperimentTypeListComponent },
    { path: 'projects/:id/experiments/new/:typeId', component: ExperimentFormComponent },
    { path: 'create-experiment-type', component: ExperimentTypeCreateComponent}

];

