import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Task } from '../models/task';
import { formatDate } from '../utils/date';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  async getTasks(date: Date): Promise<Task[]> {
    return firstValueFrom(this.http.get<Task[]>(`${this.apiUrl}/tasks?date=${formatDate(date)}`));
  }

  async updateTask(id: number, update: Partial<any>): Promise<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/tasks/${id}`, update, httpOptions));
  }
}
