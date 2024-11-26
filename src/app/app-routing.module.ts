import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'restablecer', loadChildren: () => import('./restablecer/restablecer.module').then(m => m.RestablecerPageModule) },
  { path: 'nueva-password', loadChildren: () => import('./nueva-password/nueva-password.module').then(m => m.NuevaPasswordPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'asistencia', loadChildren: () => import('./asistencia/asistencia.module').then(m => m.AsistenciaPageModule) },
  { path: 'cursos', loadChildren: () => import('./cursos/cursos.module').then(m => m.CursosPageModule) },
  { path: 'calendario', loadChildren: () => import('./calendario/calendario.module').then(m => m.CalendarioPageModule) },
  { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule) },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },
  { path: '**', redirectTo: 'not-found' }, // Ruta para páginas no encontradas

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
