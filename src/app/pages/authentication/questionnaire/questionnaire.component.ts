import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { TranslateService } from '@ngx-translate/core';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: { id: string; text: string }[];
  order: number;
}

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  imports: [importBase]
})
export class QuestionnaireComponent implements OnInit {
  loading = false;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  form: FormGroup;
  responses: { questionId: string; answer: string | string[] }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private requestService: RequestService,
    private snackBar: SnackBarService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      answer: ['', Validators.required],
      multipleAnswers: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.loadQuestions();
  }

  get currentQuestion(): Question | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  get multipleAnswersArray(): FormArray {
    return this.form.get('multipleAnswers') as FormArray;
  }

  loadQuestions() {
    this.loading = true;
    this.requestService.get('core/questionnaire/questions').subscribe({
      next: (response: any) => {
        this.questions = response.questions;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.error('Erro ao carregar questionário');
        this.loading = false;
      },
    });
  }

  onQuestionTypeChange() {
    if (this.currentQuestion?.type === 'multiple') {
      // Limpar e recriar o FormArray para múltipla escolha
      this.multipleAnswersArray.clear();
      this.currentQuestion.options?.forEach(() => {
        this.multipleAnswersArray.push(new FormControl(false));
      });
    }
  }

  nextQuestion() {
    if (!this.validateCurrentAnswer()) {
      this.snackBar.error('Por favor, responda a pergunta antes de continuar');
      return;
    }

    this.saveCurrentAnswer();

    if (this.isLastQuestion) {
      this.submitQuestionnaire();
    } else {
      this.currentQuestionIndex++;
      this.resetForm();
      this.onQuestionTypeChange();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadPreviousAnswer();
      this.onQuestionTypeChange();
    }
  }

  validateCurrentAnswer(): boolean {
    if (!this.currentQuestion) return false;

    if (this.currentQuestion.type === 'multiple') {
      const selected = this.multipleAnswersArray.value.some((val: boolean) => val === true);
      return selected;
    } else {
      return this.form.get('answer')?.value !== '';
    }
  }

  saveCurrentAnswer() {
    if (!this.currentQuestion) return;

    let answer: string | string[];

    if (this.currentQuestion.type === 'multiple') {
      const multipleAnswers: string[] = [];
      this.multipleAnswersArray.value.forEach((selected: boolean, index: number) => {
        if (selected && this.currentQuestion?.options) {
          multipleAnswers.push(this.currentQuestion.options[index].id);
        }
      });
      answer = multipleAnswers;
    } else {
      answer = this.form.get('answer')?.value;
    }

    // Remover resposta anterior se existir
    const existingIndex = this.responses.findIndex(
      (r) => r.questionId === this.currentQuestion!.id
    );
    if (existingIndex !== -1) {
      this.responses[existingIndex] = {
        questionId: this.currentQuestion.id,
        answer,
      };
    } else {
      this.responses.push({
        questionId: this.currentQuestion.id,
        answer,
      });
    }
  }

  loadPreviousAnswer() {
    if (!this.currentQuestion) return;

    const previousResponse = this.responses.find(
      (r) => r.questionId === this.currentQuestion!.id
    );

    if (previousResponse) {
      if (this.currentQuestion.type === 'multiple' && Array.isArray(previousResponse.answer)) {
        this.multipleAnswersArray.clear();
        this.currentQuestion.options?.forEach((option, index) => {
          const isSelected = previousResponse.answer.includes(option.id);
          this.multipleAnswersArray.push(new FormControl(isSelected));
        });
      } else {
        this.form.patchValue({ answer: previousResponse.answer });
      }
    }
  }

  resetForm() {
    this.form.reset();
    this.multipleAnswersArray.clear();
  }

  submitQuestionnaire() {
    this.loading = true;
    this.requestService.post('core/questionnaire/submit', { responses: this.responses }).subscribe({
      next: (response: any) => {
        this.snackBar.success('Questionário enviado com sucesso!');
        this.loading = false;
        // Redirecionar para a página inicial
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.snackBar.error('Erro ao enviar questionário');
        this.loading = false;
      },
    });
  }

  skip() {
    // Permitir pular o questionário (opcional)
    this.router.navigate(['/']);
  }
}
