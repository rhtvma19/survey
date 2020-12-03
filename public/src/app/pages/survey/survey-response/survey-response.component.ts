import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { questiontype } from '../../create-survey/create-survey.component';
import { Survey, Option } from '../../create-survey/data-models';

@Component({
  selector: 'app-survey-response',
  templateUrl: './survey-response.component.html',
  styleUrls: ['./survey-response.component.css']
})
export class SurveyResponseComponent implements OnInit {
  submitted = false;
  questionCtrl: any;
  form = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    terms: new FormControl('', [Validators.required]),
    question_1: new FormControl('', [Validators.required]),
    question_2: new FormControl('', [Validators.required]),
    question_3: new FormControl('', [Validators.required]),
    q3additional_message: new FormControl('', [Validators.required]),
    q5additional_message1: new FormControl('', [Validators.required]),
    q5additional_message2: new FormControl('', [Validators.required]),
    q5additional_message3: new FormControl('', [Validators.required]),
  });

  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastr: ToastrService) { }

  get f() {
    return this.form.controls;
  }

  surveyForm: FormGroup;

  selectedOption = [];

  editMode = false;
  types = [
    { id: 0, value: 'Training' },
    { id: 1, value: 'HR' }
  ];

  gender = [
    { id: 0, value: 'male' },
    { id: 1, value: 'female' }
  ];

  id = 0;
  isAddMode = true;
  questions: questiontype[] = [
    { value: 'Single choice', viewValue: 'Single choice' },
    { value: 'Multi choice', viewValue: 'Multi choice' },
    { value: 'Text', viewValue: 'Text' }
  ];



  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getByID(this.id);
  }

  private initForm() {
    const title = '';
    const type = '';
    const questionnaires = new FormArray([]);

    this.surveyForm = new FormGroup({
      name: new FormControl(title, [Validators.required]),
      email: new FormControl(title, [Validators.required]),
      phone: new FormControl(title, [Validators.required]),
      gender: new FormControl(type, [Validators.required]),
      questionnaires: new FormArray([]),
      expirydate: new FormControl(Date.now(), [Validators.required])
    });
  }


  get getFormControls() {
    const control = this.surveyForm.get('questionnaires') as FormArray;
    return control;
  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.surveyForm.controls;
  }


  createSurvey(): void {
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }
    console.log(this.form.value);
    const data = this.form.value;
    this.apiService.post('survey', data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
          this.toastr.success(response.message || 'Survey Successful');
          this.router.navigate(['/all-survey']);
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

  prepareSurvey() {
    const formData = this.surveyForm.value;
    console.log(formData);
    const id = 0;
    const type = formData.type;
    const title = formData.title;
    const expirydate = formData.expirydate;
    const user = this.authService.getUserId();
    const questionnaires1 = [];
    const questionnaires = formData.questionnaires;
    // const optionArray = formData.questionnaires[0].questionGroup.options[0].optionText;
    const survey = new Survey(user, type, title, expirydate, questionnaires1);
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
            optiontext: option.optionText,
            optioncolor: ''

          };
          questionItem.options.push(optionItem);
        });
      }
      // survey.questionnaires.push(questionItem);
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
          this.questionCtrl = result.data;
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


// https://stackblitz.com/edit/angular-form-wizard?file=src%2Fapp%2Fapp.component.html
