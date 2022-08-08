import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DependencyModulesModule } from 'src/app/dependency-modules/dependency-modules.module';
import { AnswersComponent } from './answers/answers.component';
import { BuilderComponent } from './builder/builder.component';
import { QuestionsComponent } from './questions/questions.component';
import { DynamicFormRoutingModule } from './dynamic-form-routing.module';

@NgModule({
  declarations: [AnswersComponent, BuilderComponent, QuestionsComponent],
  imports: [CommonModule, DependencyModulesModule, DynamicFormRoutingModule],
})
export class DynamicFormModule {}
