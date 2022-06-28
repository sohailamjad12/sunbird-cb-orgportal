import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'

@Component({
    selector: 'ws-app-roles-and-functions',
    templateUrl: './roles-and-functions.component.html',
    styleUrls: ['./roles-and-functions.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class RolesAndFunctionsComponent implements OnInit {
    roleActivityForm!: FormGroup
    instituteOtherRoleField: any = false
    private unsubscribe = new Subject<void>()

    constructor(
        private orgSvc: OrgProfileService,
        private configSvc: ConfigurationsService,
    ) {
        this.roleActivityForm = new FormGroup({
            training: new FormControl(false, [Validators.required]),
            research: new FormControl(false, [Validators.required]),
            consultancy: new FormControl(false, [Validators.required]),
            // trainingResearch: new FormControl(false, [Validators.required]),
            researchPublication: new FormControl(false, [Validators.required]),
            // trainingConsultancy: new FormControl(false, [Validators.required]),
            // trainConsulResPublication: new FormControl(false, [Validators.required]),
            other: new FormControl(false, [Validators.required]),
            instituteOtherRole: new FormControl('', []),
        })

        // tslint:disable-next-line: no-non-null-assertion
        this.roleActivityForm!.get('other')!.valueChanges
            .subscribe((value: any) => {
                if (value) {
                    // tslint:disable-next-line: no-non-null-assertion
                    this.roleActivityForm!.get('instituteOtherRole')!.setValidators(Validators.required)
                    this.roleActivityForm.updateValueAndValidity()
                } else {
                    // tslint:disable-next-line: no-non-null-assertion
                    this.roleActivityForm!.get('instituteOtherRole')!.clearValidators()
                    // tslint:disable-next-line: no-non-null-assertion
                    this.roleActivityForm!.get('instituteOtherRole')!.setErrors(null)
                    this.roleActivityForm.updateValueAndValidity()
                }
            })

        this.roleActivityForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('rolesAndFunctions', formValue)
                        this.orgSvc.updateFormStatus('rolesAndFunctions', this.roleActivityForm.valid)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()

<<<<<<< HEAD
    ngOnInit() {
        // console.log(this.roleActivityForm.value + '--------')
=======
>>>>>>> 1f8492e7db20fb3f40a746203d896531123d0420
    }

    ngOnInit() {
        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const rolesAndFunctions = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.rolesAndFunctions')
            this.roleActivityForm.patchValue({
                training: _.get(rolesAndFunctions, 'training'),
                research: _.get(rolesAndFunctions, 'research'),
                consultancy: _.get(rolesAndFunctions, 'consultancy'),
                // trainingResearch: _.get(rolesAndFunctions, 'trainingResearch'),
                researchPublication: _.get(rolesAndFunctions, 'researchPublication'),
                // trainingConsultancy: _.get(rolesAndFunctions, 'trainingConsultancy'),
                // trainConsulResPublication: _.get(rolesAndFunctions, 'trainConsulResPublication'),
                other: _.get(rolesAndFunctions, 'other'),
                instituteOtherRole: _.get(rolesAndFunctions, 'instituteOtherRole'),
            })
        }
    }
}
