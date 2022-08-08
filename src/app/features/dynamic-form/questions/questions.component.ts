import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { QuestionsConfig } from 'src/app/config/app.config';
import { QuestionModel, QuestionsDialogBoxModel } from 'src/app/models';

/**
 *QuestionsComponent component used to render dialog box for questions
 */
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  questionForm: FormGroup;

  questionTypes = QuestionsConfig.questionTypes;

  isFormSubmitted = false;
  isOtherOptionEnabled = false;
  isFieldRequired = false;

  content: QuestionsDialogBoxModel;

  contentSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<QuestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public question: any
  ) {}

  ngOnInit(): void {
    this.resolveI18nContent();
    this.createQuestionForm();
  }

  /**
   * Resolves i18n content
   */
  resolveI18nContent() {
    this.contentSubscription = this.translate
      .get('questions_dialog_box')
      .subscribe((content) => (this.content = content));
  }

  /**
   * Creates question form
   */
  createQuestionForm(): void {
    this.questionForm = this.formBuilder.group({
      type: ['paragraph', Validators.required], // paragraph or checkbox
      question: ['', Validators.required],
      options: this.formBuilder.array([]),
      answer: '',
      required: false,
    });
  }

  /**
   * Gets options
   */
  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  /**
   * Determines the type selection
   * @param selectEvent
   */
  onTypeSelection(selectEvent: MatSelectChange): void {
    if (selectEvent.value === 'paragraph') {
      this.options.clear();
    } else {
      this.addOption();
    }
  }

  /**
   * Adds option
   */
  addOption(): void {
    this.options.push(
      this.formBuilder.group({ value: ['', Validators.required] })
    );
  }

  /**
   * Removes option
   * @param index
   */
  removeOption(index: number) {
    this.options.removeAt(index);
  }

  /**
   * Max number of options exceeded checker
   * @returns boolean
   */
  maxNumberOfOptionsExceeded() {
    return this.options.length > 4;
  }

  /**
   * Adds other option
   * @param otherOption
   */
  addOtherOption(otherOption: MatCheckboxChange) {
    if (otherOption.source.checked) {
      this.isOtherOptionEnabled = true;
    } else {
      this.isOtherOptionEnabled = false;
    }
  }

  /**
   * Makes field required
   * @param field
   */
  makeFieldRequired(field: MatCheckboxChange) {
    if (field.source.checked) {
      this.isFieldRequired = true;
    } else {
      this.isFieldRequired = false;
    }
    this.questionForm.controls['required'].setValue(this.isFieldRequired);
  }

  /**
   * Determines whether submit button is invalid
   * @returns
   */
  isSubmitButtonInvalid() {
    return (
      this.questionForm.invalid ||
      (this.questionForm.value.type === 'checkbox' &&
        !this.questionForm.value.options.length)
    );
  }

  /**
   * Cancels questions component
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Submits questions component
   * @returns submit
   */
  submit(): void {
    // this.isFormSubmitted = true;
    this.questionForm.markAllAsTouched();
    let quesObj: QuestionModel = this.questionForm.getRawValue();
    const isOptionsInvalid =
      quesObj.type === 'checkbox' && !quesObj.options.length;
    if (this.questionForm.invalid || isOptionsInvalid) {
      return;
    }
    if (this.isOtherOptionEnabled)
      quesObj.options.push({ value: 'Other', checked: false, otherValue: '' });
    this.dialogRef.close(quesObj);
  }
}
