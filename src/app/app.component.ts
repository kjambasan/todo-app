import { routes } from './app.routes';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, RouterLink, CommonModule],
  template: `
    <main class="min-h-screen flex flex-col">
      <section class="content grow shrink-0 flex flex-col">
        <router-outlet></router-outlet>
      </section>

      <nav class="sticky bottom-0 w-full h-20 bg-neutral text-neutral-content flex items-center text-center justify-around">

      @for(route of routes; track route; let index = $index) {
        <a [routerLink]="['/' + route.path]" class="flex flex-col items-center gap-1 w-16">
            <span class="flex w-full items-center justify-center h-8 relative">
              @if(isActiveRoute(route.path)) {<span class="bg-primary rounded-full absolute w-full h-full"></span> }
              <span class="text-xl" [ngClass]="getClasses(index, isActiveRoute(route.path))"></span>
            </span>
            <span class="text-sm text-nowrap" [ngClass]="{'opacity-75': !isActiveRoute(route.path)}">{{ route.title }}</span>
          </a>
      }
      </nav>
    </main>
  `,
  styles: ``
})
export class AppComponent  {
  title: String = 'todo-app';
  routes: Routes = routes;

  constructor(private router: Router) {}

  getClasses(index: number, isActive: boolean): string {
    return {
      active: [
        "text-primary-content icon-[material-symbols--task]",
        "text-primary-content icon-[material-symbols--category]",
        "text-primary-content icon-[material-symbols--person]"
      ],
      nonActive: [
        "icon-[material-symbols--task-outline]",
        "icon-[material-symbols--category-outline]",
        "icon-[material-symbols--person-outline]"
      ]
    }[isActive ? 'active' : 'nonActive'][index]
  }

  isActiveRoute(path: string = ''): boolean {
    return this.router.url === `/${path}`;
  }
}
