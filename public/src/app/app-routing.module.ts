import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { SurveyComponent } from './pages/survey/survey.component';

import { GuardService as AuthGuard } from './common/services/auth/guard.service';
import { AllSurveysComponent } from './pages/all-surveys/all-surveys.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'survey', canActivate: [AuthGuard], component: SurveyComponent },
  { path: 'all-survey', canActivate: [AuthGuard], component: AllSurveysComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      // Tell the router to use the hash instead of HTML5 pushstate.
      useHash: true,
      // Enable the Angular 6+ router features for scrolling and anchors.
      // scrollPositionRestoration: 'enabled',
      // anchorScrolling: 'enabled',
      // enableTracing: false
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
