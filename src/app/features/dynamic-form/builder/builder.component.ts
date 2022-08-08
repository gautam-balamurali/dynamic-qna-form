import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RouteConstants } from 'src/app/config/route-constants';
import { DynamicFormService } from 'src/app/core';
import {
  AnswerOptionModel,
  BuilderPageModel,
  QuestionModel,
} from 'src/app/models';
import { QuestionsComponent } from '..';

/**
 *BuilderComponent component used to render builder page
 */
@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit {
  qnaForm: FormGroup;

  contentSubscription: Subscription;
  formServiceSubscription: Subscription;

  selectedOptions = [];

  checkboxTypeRequiredExists = false;
  isReviewAnswersEnabled = false;

  content: BuilderPageModel;

  ROUTE_CONST = RouteConstants.ROUTES;

  constructor(
    private formBuilder: FormBuilder,
    public formService: DynamicFormService,
    public dialog: MatDialog,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.resolveI18nContent();
    this.qnaForm = this.formBuilder.group({
      questions: this.formBuilder.array([]),
    });
    this.getQna();
  }

  /**
   * Resolves i18n content
   */
  resolveI18nContent() {
    this.contentSubscription = this.translate
      .get('builder_page')
      .subscribe((content) => (this.content = content));
  }

  /**
   * Gets qna details
   */
  getQna(): void {
    this.formService.getQnaDetails().subscribe((qna) => {
      qna.forEach((ques) => this.addQuestion(ques));
    });
  }

  /**
   * Gets questions
   */
  get questions() {
    return this.qnaForm.get('questions') as FormArray;
  }

  /**
   * Opens question dialog
   */
  openQuestionDialog(): void {
    const questionDialog = this.dialog.open(QuestionsComponent);
    this.formServiceSubscription = questionDialog
      .afterClosed()
      .subscribe((question: QuestionModel) => {
        if (question) {
          this.addQuestion(question);
        }
      });
  }

  /**
   * Adds question
   * @param question
   */
  addQuestion(question: QuestionModel): void {
    const questionFormGroup = this.formBuilder.group({
      type: question.type,
      question: question.question,
      options: this.formBuilder.array([]),
      answer: question.answer || '',
      required: question.required,
    });
    if (question.type === 'checkbox') {
      this.addOptions(questionFormGroup, question.options);
    }
    this.questions.push(questionFormGroup);
  }

  /**
   * Adds options
   * @param questionFormGroup
   * @param options
   */
  addOptions(questionFormGroup: FormGroup, options: AnswerOptionModel[]): void {
    const optionsArray = questionFormGroup.get('options') as FormArray;
    options.forEach((option) =>
      optionsArray.push(
        this.formBuilder.group({
          value: option.value,
          checked: option?.checked,
          otherValue: option?.otherValue,
        })
      )
    );
  }

  /**
   * Gets options
   * @param index
   * @param isRequired
   * @returns options
   */
  getOptions(index: number, isRequired) {
    this.checkboxTypeRequiredExists = isRequired;
    return this.questions.controls[index].get('options') as FormArray;
  }

  /**
   * Determines whether review answers is valid
   * @param checkbox
   * @param option
   */
  isReviewAnswersValid(checkbox: MatCheckboxChange, option) {
    if (checkbox.source.checked) {
      this.selectedOptions.push(option);
      this.selectedOptions = [
        ...new Map(
          this.selectedOptions.map((item) => [item['value'], item])
        ).values(),
      ];
    } else {
      this.selectedOptions = this.selectedOptions.filter(
        (opt) => opt.value !== option.value
      );
    }
  }

  /**
   * Reviews answers
   */
  reviewAnswers(): void {
    this.selectedOptions = [];
    this.formService.setQnaData(
      this.qnaForm.value.questions as QuestionModel[]
    );
    this.router.navigate([
      `/${this.ROUTE_CONST.FORM}/${this.ROUTE_CONST.ANSWERS}`,
    ]);
  }

  ngOnDestroy(): void {
    this.formServiceSubscription?.unsubscribe();
    this.contentSubscription?.unsubscribe();
  }
}
