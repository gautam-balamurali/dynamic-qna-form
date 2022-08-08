import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RouteConstants } from 'src/app/config/route-constants';
import { DynamicFormService } from 'src/app/core';
import { AnswersPageModel, QuestionModel } from 'src/app/models';

/**
 *AnswersComponent component used to render answers page
 */
@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss'],
})
export class AnswersComponent implements OnInit {
  qna: QuestionModel[];

  contentSubscription: Subscription;
  formServiceSubscription: Subscription;

  content: AnswersPageModel;

  ROUTE_CONST = RouteConstants.ROUTES;

  constructor(
    private router: Router,
    public formService: DynamicFormService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.resolveI18nContent();
    this.getQna();
  }

  /**
   * Resolves i18n content
   */
  resolveI18nContent() {
    this.contentSubscription = this.translate
      .get('answers_page')
      .subscribe((content) => (this.content = content));
  }

  /**
   * Gets qna details
   */
  getQna(): void {
    this.formServiceSubscription = this.formService
      .getQnaDetails()
      .subscribe((qna) => (this.qna = qna));
  }

  /**
   * no option selected checker
   * @param obj
   * @returns boolean
   */
  noOptionSelected(obj: QuestionModel) {
    let countOfOptionsNotSelected = 0;
    obj.options.forEach(
      (option) =>
        (countOfOptionsNotSelected = option.checked
          ? countOfOptionsNotSelected
          : countOfOptionsNotSelected++)
    );
    return countOfOptionsNotSelected == obj.options.length;
  }

  /**
   * Back to forms builder
   */
  backToFormBuilder(): void {
    this.router.navigate([
      `/${this.ROUTE_CONST.FORM}/${this.ROUTE_CONST.BUILDER}`,
    ]);
  }

  ngOnDestroy(): void {
    this.formServiceSubscription?.unsubscribe();
    this.contentSubscription?.unsubscribe();
  }
}
