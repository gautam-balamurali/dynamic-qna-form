import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuestionModel } from 'src/app/models';

/**
 *DynamicFormService service class is a generic class to handle all the services related to form
 */
@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  _qna = new BehaviorSubject<QuestionModel[]>([]);

  constructor() {}

  /**
   * Sets qna data
   * @param questions
   */
  setQnaData(questions: QuestionModel[]): void {
    this._qna.next(questions);
  }

  /**
   * Gets qna details
   * @returns qna details
   */
  getQnaDetails(): Observable<QuestionModel[]> {
    return this._qna.asObservable();
  }
}
