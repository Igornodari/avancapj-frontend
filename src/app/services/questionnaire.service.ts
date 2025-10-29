import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';

export interface QuestionnaireStatus {
  completed: boolean;
  userId: string;
}

export interface UserProfile {
  userId: string;
  workArea: string;
  businessType: string;
  needs: string[];
  recommendedTools: string[];
  questionnaireCompleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private requestService: RequestService) {}

  getQuestionnaireStatus(): Observable<QuestionnaireStatus> {
    return this.requestService.get('questionnaire/status');
  }

  getUserProfile(): Observable<UserProfile> {
    return this.requestService.get('questionnaire/profile');
  }

  hasCompletedQuestionnaire(): Promise<boolean> {
    return new Promise((resolve) => {
      this.getQuestionnaireStatus().subscribe({
        next: (status) => resolve(status.completed),
        error: () => resolve(false),
      });
    });
  }
}
