import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { ExamDetailComponent } from './pages/exam/exam-detail/exam-detail.component';
import { ExamListComponent } from './pages/exam/exam-list/exam-list.component';
import { ExamPresentationComponent } from './pages/exam/exam-presentation/exam-presentation.component';
import { ExamResultComponent } from './pages/exam/exam-result/exam-result.component';
import { QuestionBankComponent } from './pages/question/question-bank/question-bank.component';
import { QuestionFormComponent } from './pages/question/question-form/question-form.component';
import { QuestionPreviewComponent } from './pages/question/question-preview/question-preview.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import {RolComponent} from './pages/user/rol/rol.component';
import { ExamCreateComponent } from './pages/exam/exam-create/exam-create.component';
import { CategoriaComponent } from './pages/subjects/categoria/categoria.component';
import { UnidadComponent } from './pages/subjects/unidad/unidad.component';
import { ContenidoComponent } from './pages/subjects/contenido/contenido.component';
import { TemaComponent } from './pages/subjects/tema/tema.component';
import { PresentarComponent } from './pages/student/presentar/presentar.component';
import { CalificacionesComponent } from './pages/student/calificaciones/calificaciones.component';
import { PresentandoComponent } from './pages/student/presentando/presentando.component';
import { VistaProfesorComponent } from './pages/subjects/vista-profesor/vista-profesor.component';
import { CursoComponent } from './pages/subjects/curso/curso.component';
import { GrupoComponent } from './pages/subjects/grupo/grupo.component';
import { EstudianteComponent } from './pages/subjects/estudiante/estudiante.component';
import { HorarioComponent } from './pages/student/horario/horario.component';
import { InfoAcademicaComponent } from './pages/student/info-academica/info-academica.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [

    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent , canActivate: [AuthGuard]},
    { path: 'exam-detail', component: ExamDetailComponent },
    { path: 'exam-list', component: ExamListComponent },
    { path: 'exam-presentation', component: ExamPresentationComponent },
    { path: 'exam-result', component: ExamResultComponent },
    { path: 'ques-bank', component: QuestionBankComponent , canActivate: [AuthGuard]},
    { path: 'ques-create', component: QuestionFormComponent , canActivate: [AuthGuard]},
    { path: 'ques-prev', component: QuestionPreviewComponent},
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'rol', component: RolComponent , canActivate: [AuthGuard]},
    { path: 'exam-create', component: ExamCreateComponent , canActivate: [AuthGuard]},
    { path: 'categoria', component: CategoriaComponent , canActivate: [AuthGuard]},
    { path: 'unidad', component: UnidadComponent , canActivate: [AuthGuard]},
    { path: 'contenido', component: ContenidoComponent , canActivate: [AuthGuard]},
    { path: 'tema', component: TemaComponent , canActivate: [AuthGuard]},
    { path: 'info-academica', component: InfoAcademicaComponent },
    { path: 'presentar', component: PresentarComponent },
    { path: 'calificaciones', component: CalificacionesComponent },
    { path: 'presentando', component: PresentandoComponent },
    { path: 'profesor', component: VistaProfesorComponent , canActivate: [AuthGuard]},
    { path: 'curso', component: CursoComponent , canActivate: [AuthGuard]},
    { path: 'grupo', component: GrupoComponent },
    { path: 'estudiantes', component: EstudianteComponent , canActivate: [AuthGuard]},
    { path: 'horario', component: HorarioComponent , canActivate: [AuthGuard]},
    



    {path: '**', redirectTo: 'login'}
];
