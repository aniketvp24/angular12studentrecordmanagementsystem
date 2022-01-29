import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Student, StudentDetails } from './dashboard';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ConfirmationService],
})
export class DashboardComponent implements OnInit {
  title: string = 'Dashboard';
  student: Student = {
    id: 1,
    name: 'Rahul',
  };
  buttonName: string = 'Show';
  isDetailsVisible: boolean = false;
  studentDetails: any = [];
  selectedStudentDetails: any;

  studentModal: StudentDetails = {};
  submitted: boolean = false;
  studentDialog: boolean = false;

  constructor(
    private readonly dashboardService: DashboardService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // const studentData = [
    //   {
    //     id: 1,
    //     name: 'Rahul Pawar',
    //   },
    //   {
    //     id: 2,
    //     name: 'Vishal Pawar',
    //   },
    // ];
    // this.studentDetails = studentData;

    // this.studentModal = {
    //   ID: 0,
    //   firstName: '',
    //   lastName: '',
    //   gender: '',
    //   age: 0,
    //   address: '',
    //   phoneNumber: 0,
    // };
    this.getStudentDetails();
  }

  getStudentDetails() {
    this.dashboardService.getStudentDetailsFromJSON().subscribe(
      (response: any) => {
        this.studentDetails = response;
        console.info('Response', this.studentDetails);
      },
      (error: any) => {
        console.error('Error', error);
      }
    );
  }

  onKeyupValue() {
    const stringRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const data = stringRegex.test(this.student.name);
    console.info('Name', data, this.student.name);
  }

  onClickAdd() {
    if (this.student.name.length > 1) {
      this.isDetailsVisible = !this.isDetailsVisible;
      this.isDetailsVisible
        ? (this.buttonName = 'Hide')
        : (this.buttonName = 'Show');
    } else {
      alert('Name is required.');
    }
  }

  addNewStudent() {
    this.studentModal = {};
    this.submitted = false;
    this.studentDialog = true;
  }

  onClickEdit(event: any) {
    console.info('Event Edit', event);
    this.studentModal = { ...event };
    this.studentDialog = true;
  }

  saveStudentDetails() {
    this.submitted = true;

    if (
      !this.dashboardService.isEmpty(this.studentModal.firstName) &&
      !this.dashboardService.isEmpty(this.studentModal.lastName) &&
      !this.dashboardService.isEmpty(this.studentModal.age) &&
      !this.dashboardService.isEmpty(this.studentModal.address) &&
      !this.dashboardService.isEmpty(this.studentModal.gender) &&
      !this.dashboardService.isEmpty(this.studentModal.phoneNumber)
    ) {
      if (this.studentModal.firstName?.trim()) {
        if (this.studentModal.ID) {
          this.studentDetails[this.findIndexById(this.studentModal.ID)] =
            this.studentModal;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Student details updated successfully.',
            life: 3000,
          });
        } else {
          this.studentModal.ID = this.createId();
          this.studentDetails.push(this.studentModal);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Student details added successfully.',
            life: 3000,
          });
        }

        this.studentDetails = [...this.studentDetails];
        this.studentDialog = false;
        this.studentModal = {};
      }
    }
  }

  findIndexById(ID: number): number {
    let index = -1;
    for (let i = 0; i < this.studentDetails.length; i++) {
      if (this.studentDetails[i].ID === ID) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    return this.studentDetails.length + 1;
  }

  hideDialog() {
    this.studentDialog = false;
  }

  onClickDelete(data: any) {
    console.info('Delete Data', data);
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete details for ' +
        data.firstName +
        ' ' +
        data.lastName +
        ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentDetails = this.studentDetails.filter(
          (val: any) => val.ID !== data.ID
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Student Details Deleted Successful',
          life: 3000,
        });
      },
    });
  }
}
