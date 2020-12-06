import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/auth.service';
import { DataService } from '../services/data.service';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  constructor(
    public auth: AuthService,
    public dataService: DataService,
    private apiService: ApiService,
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.dataService.getProfileObs().subscribe(profile => this.isLoggedIn = profile);
  }

  logout() {
    this.auth.logout();
    this.dataService.setProfileObs(false);
  }

  openSurvey() {
    // window.location.href = '/#/survey';
    window.location.reload();
  }

  exportSurveyaaaa() {
    const doc = new jsPDF.jsPDF();
    let col = ['Id', 'TypeID', 'Accnt', 'Amnt', 'Start', 'End', 'Contrapartida'];
    let rows = [];

    let rowCountModNew = [
      ['1721079361', '0001', '2100074911', '200', '22112017', '23112017', '51696'],
      ['1721079362', '0002', '2100074912', '300', '22112017', '23112017', '51691'],
      ['1721079363', '0003', '2100074913', '400', '22112017', '23112017', '51692'],
      ['1721079364', '0004', '2100074914', '500', '22112017', '23112017', '51693']
    ];

    rowCountModNew.forEach(element => {
      rows.push(element);

    });

    // doc.autoTable(col, rows);
    doc.save('survey.pdf');
  }


  exportSurvey() {
    this.apiService.get('result/' + this.authService.getUserId())
      .subscribe(
        response => {
          console.log(response);
          // this.toastr.success(response.message || 'Survey fetch Successful');
          this.preparePDF(response.data);
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

  preparePDF(data) {
    const doc = new jsPDF.jsPDF();
    let col = ['name', 'email', 'phone', 'questiontype', 'questiontitle', 'answerText'];
    let rows = [];

    let rowCountModNew = [
      ['1721079361', '0001', '2100074911', '200', '22112017', '23112017', '51696'],
      ['1721079362', '0002', '2100074912', '300', '22112017', '23112017', '51691'],
      ['1721079363', '0003', '2100074913', '400', '22112017', '23112017', '51692'],
      ['1721079364', '0004', '2100074914', '500', '22112017', '23112017', '51693']
    ];
    /** 
     
    createdAt: "2020-12-05T20:21:27.207Z"
    expirydate: "2020-12-10T18:30:00.000Z"
    questionnaires: (3) [{…}, {…}, {…}]
    title: "ABput yourself"
    type: "Multiple choice"
    updatedAt: "2020-12-05T20:21:27.207Z"
    user: "5fc8d0d403c6c115b33f5995"
    
    
    
    questionnaires: Array(3)
    0:
    createdAt: "2020-12-05T20:21:27.206Z"
    options: (3) [{…}, {…}, {…}]
    questiontitle: "are you okay?"
    questiontype: "Multiple choice"
    updatedAt: "2020-12-05T20:21:27.206Z"
    _id: "5fcbebc7de
    
    */



    data.forEach(element => {

      const choices = element.choices;
      choices.forEach((choice, i) => {
        let currentRow = [];
        if (i === 0) {
          currentRow.push(element.name);
          currentRow.push(element.email);
          currentRow.push(element.phone);
        } else {
          currentRow.push('');
          currentRow.push('');
          currentRow.push('');
        }
        currentRow.push(choice.questiontype);
        currentRow.push(choice.questiontitle);
        currentRow.push(choice.answerText);

        rows.push(currentRow);
      });

    });

    doc.autoTable(col, rows);
    doc.save('Test.pdf');
  }
}
