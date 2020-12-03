import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { Survey, Question, Option } from './data-models';
export interface questiontype {
  value: string;
  viewValue: string;
}

const QUESTIONTYPES: questiontype[] = [
  { value: 'Agree/ Disagree', viewValue: 'Agree/ Disagree' },
  { value: 'Multiple choice', viewValue: 'Multiple choice' },
  { value: 'Short Answer', viewValue: 'Short Answer' }
]
@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;

  selectedOption = [];
  questiontype: any;
  editMode = false;
  types = [
    { id: 0, value: 'Multiple choice' },
    { id: 1, value: 'Agree/ Disagree' },
    { id: 2, value: 'Short Answer' }
  ];

  id = 0;
  isAddMode = true;
  questions: questiontype[] = QUESTIONTYPES;

  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
      this.getByID(this.id);
    }
  }

  private initForm() {
    const title = '';
    const type = '';
    const questionnaires = new FormArray([]);

    this.surveyForm = this.formBuilder.group({
      title: new FormControl(title, [Validators.required]),
      type: new FormControl(type, [Validators.required]),
      questionnaires: this.formBuilder.array([]),
      expirydate: new FormControl(Date.now(), [Validators.required])
    });
  }


  get getFormControls() {
    const control = this.surveyForm.get('questionnaires') as FormArray;
    return control;
  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.surveyForm?.controls;
  }

  onSeletquestiontypeMain(e) {
    this.questiontype = e.value;
    const length = (this.surveyForm.get('questionnaires') as FormArray).length;
    this.clearFormArray((this.surveyForm.get('questionnaires') as FormArray));
    this.onAddQuestion();

  }
  setQuestionnaires(que) {
    let control = <FormArray>this.surveyForm?.controls.questionnaires;
    que.forEach(x => {
      control.push(this.formBuilder.group(x));
    });
  }
  onAddQuestion() {
    console.log(this.surveyForm);
    const surveyQuestionItem = new FormGroup({
      questiontitle: new FormControl('', Validators.required),
      questiontype: new FormControl('', Validators.required),
      questionGroup: new FormGroup({})
    });

    (this.surveyForm.get('questionnaires') as FormArray).push(surveyQuestionItem);

    this.questions = QUESTIONTYPES.filter((val) => {
      return val.value === this.questiontype;
    });
  }

  onRemoveQuestion(index: number) {
    const control = this.surveyForm.get('questionnaires') as FormArray;
    control.removeAt(index);
    this.selectedOption.splice(index, 1);
    console.log(this.surveyForm);
  }

  onRemoveQuestionOld(index) {
    this.surveyForm?.controls.questionnaires[index]?.controls.questionGroup = new FormGroup({});
    this.surveyForm?.controls.questionnaires[index]?.controls.questiontype = new FormControl({});
    (this.surveyForm.get('questionnaires') as FormArray).removeAt(index);
    this.selectedOption.splice(index, 1);
    console.log(this.surveyForm);
  }


  onSeletquestiontype(questiontype, index) {
    if (questiontype === 'Agree/ Disagree' || questiontype === 'Multiple choice' || questiontype === 'Short Answer') {
      this.addOptionControls(questiontype, index);
    }
  }

  addOptionControls(questiontype, index) {
    const options = new FormArray([]);
    const showRemarksBox = new FormControl(false);

    const control = this.surveyForm.get('questionnaires') as FormArray;

    (this.surveyForm?.controls.questionnaires?.controls[index]?.controls?.questionGroup)?.addControl('options', options);
    // (this.surveyForm?.controls.questionnaires?.controls[index]?.controls.questionGroup).addControl('showRemarksBox', showRemarksBox);

    this.clearFormArray((this.surveyForm?.controls.questionnaires?.controls[index]?.controls.questionGroup?.controls.options as FormArray));

    this.addOption(index);
    this.addOption(index);
  }


  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }


  addOption(index) {
    const optionGroup = new FormGroup({
      optionText: new FormControl('', Validators.required),
    });
    (this.surveyForm?.controls.questionnaires?.controls[index]?.controls.questionGroup?.controls.options as FormArray).push(optionGroup);
  }

  removeOption(questionIndex, itemIndex) {
    (this.surveyForm?.controls.questionnaires?.controls[questionIndex]?.controls.questionGroup?.controls.options as FormArray).removeAt(itemIndex);
  }

  prepareSurvey() {
    const formData = this.surveyForm.value;
    console.log(formData);
    const id = 0;
    const type = formData.type;
    const title = formData.title;
    const expirydate = formData.expirydate;
    const user = this.authService.getUserId();

    const questionnaires = formData.questionnaires;
    // const optionArray = formData.questionnaires[0].questionGroup.options[0].optionText;
    const survey = new Survey(user, type, title, expirydate, []);
    questionnaires.forEach((question, index, array) => {
      const questionItem = {
        // id: 0,
        questiontype: question.questiontype,
        questiontitle: question.questiontitle,
        options: []
      };
      // if (question.questionGroup.hasOwnProperty('showRemarksBox')) {
      //   questionItem.hasRemarks = question.questionGroup.showRemarksBox;
      // }
      if (question.questionGroup.hasOwnProperty('options')) {
        question.questionGroup.options.forEach(option => {
          const optionItem: Option = {
            // id: 0,
            optiontext: option.optionText || 'NA',
            optioncolor: ''

          };
          questionItem.options.push(optionItem);
        });
      }
      survey.questionnaires.push(questionItem);
    });

    console.log(survey);
    console.log('posting survey');
    return survey;
  }

  add(body) {
    this.apiService.post('survey', body)
      .subscribe(
        response => {
          console.log(response);
          this.toastr.success(response.message || 'Survey creation Successful');
          // this.router.navigate(['/login']);
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

  edit(body) {
    this.apiService.put('survey', this.id, body)
      .subscribe(
        (data: any) => {
          this.toastr.success('survey updated successful');
          this.router.navigate(['/survey']);
        },
        (error: any) => {
          // this.toastr.error(error);
          console.log(error);
        });
  }

  getByID(id: number) {
    this.apiService.get('survey/' + id)
      .subscribe(
        (result: any) => {
          this.toastr.success('Survey fetch successfull');
          this.surveyForm.patchValue(result.data);
          this.setQuestionnaires(result.data.questionnaires);
        },
        (error: any) => {
          // this.toastr.error(error);
          console.log(error);
        });
  }

  onSubmit() {
    if (this.isAddMode) {
      this.add(this.prepareSurvey());
    } else {
      this.edit(this.prepareSurvey());
    }
  }



}
