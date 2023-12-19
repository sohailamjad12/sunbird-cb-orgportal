
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TrainingPlanService } from '../../services/traininig-plan.service'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
@Component({
  selector: 'ws-app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})

export class CreatePlanComponent implements OnInit, OnDestroy {

  selectedTabData = 'createPlan'
  nextTab = ''
  createCheck: any
  planId = ''
  constructor(
    private route: ActivatedRoute,
    private trainingPlanService: TrainingPlanService,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService) {
  }

  ngOnDestroy() {

  }

  ngOnInit() {
    this.route.queryParams.subscribe((_res: any) => {
      if (_res && _res.planId) {
        this.getContentData(_res.planId)
      }
    })
  }

  getContentData(_id: string) {
    this.trainingPlanService.readPlan(_id).subscribe((response: any) => {
      console.log('read data', response)
      if (response && response.result && response.result.content) {
        console.log('read data', response)
        if (response && response.result && response.result.content) {
          console.log('trainingPlanDataSharingService', this.trainingPlanDataSharingService)
          this.trainingPlanDataSharingService.trainingPlanTitle = response.result.content.name
          this.trainingPlanDataSharingService.trainingPlanContentData = { data: { content: response.result.content.contentList } }
          if (this.trainingPlanDataSharingService.trainingPlanAssigneeData) {
            if (response.result.content.userType === 'custom') {
              this.trainingPlanDataSharingService.trainingPlanAssigneeData['category'] = 'Custom Users'
            } else {
              this.trainingPlanDataSharingService.trainingPlanAssigneeData['category'] = response.result.content.userType
            }
          }
          if (response.result.content.userType === 'custom') {
            this.trainingPlanDataSharingService.trainingPlanAssigneeData = { data: { content: response.result.content.userDetails } }
          } else {
            this.trainingPlanDataSharingService.trainingPlanAssigneeData = response.result.content.userDetails
          }
          this.trainingPlanDataSharingService.trainingPlanStepperData['endDate'] = response.result.content.endDate
          this.trainingPlanDataSharingService.trainingPlanStepperData['status'] = response.result.content.status
        }
      }
    })
  }

  selectedTabAction(_event: any) {
    this.selectedTabData = _event
    this.nextTab = _event
  }

  changeTab(_event: any) {
    this.nextTab = _event
  }

  isPlanTitleInvalid(_event: any) {
    this.createCheck = {
      ...this.createCheck,
      titleIsInvalid: _event,
    }
  }

  isAddContentInvalid(_event: any) {
    this.createCheck = {
      ...this.createCheck,
      addContentIsInvalid: _event,
    }
  }

  isAddAssigneeInvalid(_event: any) {
    this.createCheck = {
      ...this.createCheck,
      addAssigneeIsInvalid: _event,
    }
  }

}