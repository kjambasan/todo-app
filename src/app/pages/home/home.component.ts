import { CommonModule } from '@angular/common';
import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { getCurrentWeek, getWeekDays, getDay, isToday, isSameDay, monthDayFormat, formatDate } from '../../utils/date';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full flex flex-col min-h-[calc(100dvh-5rem)] relative">
      <header class="sticky w-full">
        <div class="pl-4 pr-1 py-2 flex items-center">
          <h2 class="text-xl font-bold">{{ displayDate() }}</h2>
          <div class="grow"></div>

          @if(!isActiveDateToday()) {
            <button class="btn btn-ghost btn-circle text-xl" (click)="setActiveDateToToday()">
              <span class="icon-[material-symbols--today]"></span>
            </button>
          }

          <button class="btn btn-ghost btn-circle text-xl" (click)="toggleDisplayMenu()">
            <span class="icon-[material-symbols--flex-no-wrap]"></span>
          </button>

          <button class="btn btn-ghost btn-circle text-xl">
            <span class="icon-[material-symbols--more-vert]"></span>
          </button>
        </div>

        <div class="w-full duration-300 overflow-hidden" [ngClass]="{'h-16': showDisplayMenu(), 'h-0': !showDisplayMenu()}">
          <div class="w-full grid grid-cols-4 py-2 gap-4 px-4 bg-base-300">
            <!-- BUTTONS DOES NOTHING: FOR UI ONLY -->
            @for(displayMenuItem of displayMenuItems; track displayMenuItem.label; let index = $index) {
              <button class="btn btn-ghost text-xl" (click)="toggleDisplayMenu()">
                <div class="flex flex-col items-center gap-1" [ngClass]="{'text-primary': index === 0}">
                  <span [ngClass]="displayMenuItem.icon"></span>
                  <span class="text-xs">{{ displayMenuItem.label }}</span>
                </div>
              </button>
            }
          </div>
        </div>

        <div class="w-full grid grid-cols-7 py-2 gap-4 px-4">
          @for(weekDay of weekDays; track weekDay) {
            <div class="text-center text-xs opacity-50">
              {{ weekDay.slice(0, 3) }}
            </div>
          }
        </div>

        <div class="w-full grid grid-cols-7 gap-4 px-4 py-2" >
          @for(date of dates(); track date) {
            <button
              class="btn btn-circle w-full max-w-20 aspect-square min-h-0 h-auto m-auto"
              [ngClass]="{'btn-ghost': !isToday(date) && !isActiveDate(date), 'btn-outline': isToday(date) && !isActiveDate(date), 'btn-primary': isActiveDate(date)}"
              (click)="setActiveDate(date)"
            >
              {{ getDay(date) }}
          </button>
          }
        </div>
      </header>

      <div class="w-full bg-base-200 grow rounded-t-box">
        <div class="w-full grid h-fit gap-4 p-4">
          @for(task of tasks(); track task.id) {
            <div class="flex gap-2 items-center">
              <div class="card grow bg-neutral text-neutral-content p-4 flex-row justify-between" [ngClass]="{'opacity-50': task.done}">
                <span class="relative flex items-center" [ngClass]="{'before:absolute before:w-full before:h-px before:bg-neutral-content': task.done}">{{ task.title }}</span>

                <button class="btn btn-xs btn-outline btn-circle btn-primary" [ngClass]="{'bg-primary': task.done}" (click)="updateTask(task)">
                  @if(task.done) { <span class="text-primary-content icon-[material-symbols--check] text-xl"></span> }
                </button>
              </div>

              @if(task.done) {
                <button class="btn btn-xs btn-ghost" (click)="deleteTask(task)">
                  Delete
                </button>
              }
            </div>
          }
        </div>
      </div>

      <button class="btn btn-secondary btn-circle fixed right-4 bottom-24" onclick="new_task_modal.showModal()">
        <span class="icon-[material-symbols--add] text-xl"></span>
      </button>

      <dialog id="new_task_modal" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h2>New Task</h2>
          <form class="flex flex-col gap-4 mt-4">
            <label class="input input-bordered flex items-center gap-2">
              Title
              <input type="text" class="grow" placeholder="" #title/>
            </label>
            <button class="btn btn-primary" type="button" onclick="new_task_modal.close();" (click)="addTask(title)">Add</button>
          </form>
        </div>
      </dialog>
    </section>
  `,
  styles: ``
})

export class HomeComponent {
  displayMenuItems: {icon: string, label: string}[] = [
    {icon: 'icon-[material-symbols--flex-no-wrap]', label: 'List' },
    {icon: 'icon-[material-symbols--calendar-view-month-outline]', label: 'Month' },
    {icon: 'icon-[material-symbols--calendar-view-day-outline]', label: 'Day' },
    {icon: 'icon-[material-symbols--calendar-view-week-outline]', label: 'Week' },
  ]

  weekDays: string[] = getWeekDays()
  dates: WritableSignal<Date[]> = signal([])
  activeDate: WritableSignal<Date> = signal(new Date())
  displayDate: Signal<string> = computed(() => monthDayFormat(this.activeDate()))
  showDisplayMenu: WritableSignal<boolean> = signal(false)
  isActiveDateToday: Signal<boolean> = computed(() => this.isActiveDate(new Date()))
  tasks = signal<Task[]>([])

  constructor(private todoService: TodoService) {
    this.dates.update(() => getCurrentWeek())
  }

  ngOnInit(): void {
    this.getTasks()
  }

  getDay = getDay
  isToday = isToday

  async getTasks(): Promise<void> {
    const data = await this.todoService.getTasks(this.activeDate())
    console.log('HomeComponent', `getTasks: data = ${data}`)
    this.tasks.update(() => data);
  }

  async updateTask({id, done}: Task): Promise<void> {
    const data = await this.todoService.updateTask(id, {done: !done})
    console.log('HomeComponent', `updateTask: data = ${data}`)
    this.getTasks() // UPDATE TASK LIST
  }

  async deleteTask({id}: Task): Promise<void> {
    const data = await this.todoService.deleteTask(id)
    console.log('HomeComponent', `deleteTask: data = ${data}`)
    this.getTasks() // UPDATE TASK LIST
  }

  async addTask(input: HTMLInputElement): Promise<void> {
    // NOT APPLICABLE IN REAL WORLD SCENARIO
    const items = this.tasks()
    const highestId = items.reduce((max, item) => parseInt(item.id) > parseInt(max.id) ? item : max, items[0]);

    const title = input.value;
    input.value = "";
    const data = await this.todoService.addTask({
      id: (parseInt(highestId?.id ?? 0) + 1)+"", title, done: false, date: formatDate(this.activeDate())
    })
    console.log('HomeComponent', `createNewTask: data = ${data}`)
    this.getTasks() // UPDATE TASK LIST
  }

  isActiveDate(date: Date): boolean {
    const activeDate = this.activeDate()
    return isSameDay(activeDate, date)
  }

  setActiveDate(date: Date): void {
    this.showDisplayMenu.update(() => false)
    this.activeDate.update(() => date)
    this.getTasks()
  }

  setActiveDateToToday(): void {
    this.setActiveDate(new Date())
  }

  toggleDisplayMenu(): void {
    this.showDisplayMenu.update(() => !this.showDisplayMenu())
  }
}
