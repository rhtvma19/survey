import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
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
  questionDetails: any;
  surveyForm: FormGroup;
  selectedOption = [];
  id = 0;

  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getByID(this.id);
    this.initForm();
  }

  private initForm() {
    this.surveyForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      questionnaires: this.formBuilder.array([])
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

  setQuestionnaires(que) {
    // const surveyQuestionItem = this.formBuilder.group({
    //   questiontitle: new FormControl('', Validators.required),
    //   questiontype: new FormControl('', Validators.required),
    //   questionGroup: new FormGroup({})
    // });

    let control = <FormArray>this.surveyForm.controls.questionnaires;
    que.forEach(x => {
      control.push(this.formBuilder.group(x));
    });


    // const vlans = new FormArray([]);
    // que.forEach(x => {
    //   // (this.surveyForm.get('questionnaires') as FormArray).push(surveyQuestionItem);
    //   console.log(x);
    //   vlans.push(this.formBuilder.group(x));
    // });
    // this.surveyForm.setControl('questionnaires', vlans);
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
          this.questionDetails = result.data;
          console.log(this.questionDetails);
          this.surveyForm.patchValue(result.data);
          this.setQuestionnaires(result.data.questionnaires);
        },
        (error: any) => {
          // this.toastr.error(error);
          console.log(error);
        });
  }

  onSubmit() {
    // if (this.isAddMode) {
    //   this.add(this.prepareSurvey());
    // } else {
    //   this.edit(this.prepareSurvey());
    // }
  }

}


// https://stackblitz.com/edit/angular-form-wizard?file=src%2Fapp%2Fapp.component.html
