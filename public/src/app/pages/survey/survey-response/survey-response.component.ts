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
  optionQuestions = {};
  favoriteSeason;

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

  getQuestionGroupOptionsForm(index): FormArray {
    const control = this.getQuestionGroupForm(index).controls['options'] as FormArray;
    return control;
  }


  getQuestionGroupForm(index) {
    const control = this.getQuestionnairesIndexForm(index).controls['questionGroup'];
    return control;
  }

  getQuestionnairesIndexForm(index) {
    const control = this.getQuestionnairesForm.controls['' + index] as FormArray;
    return control;
  }


  get getQuestionnairesForm() {
    const control = this.surveyForm.controls['questionnaires'] as FormArray;
    return control;
  }

  // convenience getter for easy access to form fields
  get getSurveyForm() {
    return this.surveyForm?.controls;
  }



  addOption(index) {
    const optionGroup = new FormGroup({
      optiontext: new FormControl('', Validators.required),
    });

    const control = this.surveyForm.get('questionnaires') as FormArray;
    const indexControl = control.get('' + index) as FormArray;
    const questionGroupControl = indexControl.get('questionGroup') as FormArray;
    const optionsControl = questionGroupControl.get('options') as FormArray;
    // optionsControl.push(optionGroup);
    this.getQuestionGroupOptionsForm(index).push(optionGroup);

    // (this.surveyForm?.controls.questionnaires?.controls[index]?.controls.questionGroup?.controls.options as FormArray).push(optionGroup);
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  addOptionControls(question, index) {
    const control = this.surveyForm.get('questionnaires') as FormArray;
    const indexControl = control.get('' + index) as FormArray;
    const questionGroupControl = indexControl.controls['questionGroup'] as FormArray;
    this.getQuestionGroupForm(index).addControl('options', this.formBuilder.array([]));


    this.getQuestionGroupForm(index).patchValue(question);
    this.clearFormArray(this.getQuestionGroupOptionsForm(index) as FormArray);
    this.addOption(index);
    this.addOption(index);
  }




  // (this.surveyForm.get('questionnaires') as FormArray).push(surveyQuestionItem);



  setQuestionnaires(que) {
    const questions = que;
    let control = <FormArray>this.surveyForm.controls.questionnaires;
    que.forEach((x, i) => {
      this.optionQuestions[i] = [];
      x.questionGroup.options.forEach((xx, ii) => {
        this.optionQuestions[i].push(xx.optiontext);
      });

      const surveyQuestionItem = this.formBuilder.group({
        questiontitle: new FormControl(x.questiontitle, Validators.required),
        questiontype: new FormControl(x.questiontype, Validators.required),
        questionGroup: new FormGroup({})
      });

      control.push(surveyQuestionItem);
      // this.setQuestionGroupOptions(x.questionGroup, i);
    });

    let controls = <FormArray>this.surveyForm.controls.questionnaires;

    controls.controls.forEach((x, i) => {
      this.getQuestionGroupForm(i).addControl('options', this.formBuilder.array([]));
      // this.getQuestionGroupForm(i).patchValue(x);
      const optionControl = this.getQuestionGroupForm(i).controls['options'] as FormArray;
      const ffff = questions[i].questionGroup.options;
      console.log(ffff);
      ffff.forEach((xx, ii) => {
        optionControl.controls.push(xx);
      });

      console.log(this.getQuestionGroupForm(i));
    });

    let controlaaa = <FormArray>this.surveyForm.controls.questionnaires;

    console.log(controlaaa);
  }

  setQuestionGroupOptions(questionGroup, i) {
    const control = this.getQuestionGroupForm(i) as FormArray;
    // control.push(this.formBuilder.group(options));

    // options.forEach((x) => {
    //   control.push(this.formBuilder.group(x));
    // });
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
    // const optionArray = formData.questionnaires[0].questionGroup.options[0].optiontext;
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
            optiontext: option.optiontext,
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

  onAddQuestion() {
    console.log(this.surveyForm);
    const surveyQuestionItem = new FormGroup({
      questiontitle: new FormControl('', Validators.required),
      questiontype: new FormControl('', Validators.required),
      questionGroup: new FormGroup({})
    });

    (this.surveyForm.get('questionnaires') as FormArray).push(surveyQuestionItem);

    // this.questions = QUESTIONTYPES.filter((val) => {
    //   return val.value === this.questiontype;
    // });
  }

  getByID(id: number) {
    this.apiService.get('survey/' + id)
      .subscribe(
        (result: any) => {
          this.toastr.success('Survey fetch successfull');
          this.questionDetails = result.data;
          console.log(this.questionDetails);
          this.surveyForm.patchValue(result.data);

          result.data.questionnaires = result.data.questionnaires.map((val) => {
            val.questionGroup = { options: val.options };
            return val;
          });

          // result.data.questionnaires.map((x, i) => {
          //   this.onAddQuestion();
          // });

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
