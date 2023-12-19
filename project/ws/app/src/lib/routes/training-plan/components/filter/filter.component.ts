import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { TrainingPlanService } from './../../services/traininig-plan.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Output() toggleFilter = new EventEmitter() 
  @Output() getFilterData = new EventEmitter();
  providersList: any[] = [];
  selectedProviders: any[] = [];
  competencyTypeList = [{ "id": "Behavioral", name: 'Behavioural' }, { "id": 'Functional', name: 'Functional' }, { "id": 'Domain', name: 'Domain' }];
  competencyList: any = [];
  competencyThemeList: any[] = [];
  competencySubThemeList: any[] = [];
  filterObj:any = {"competencyArea":[], "competencyTheme": [], "competencySubTheme": []};
  searchThemeControl = new FormControl();
  constructor(private trainingPlanService: TrainingPlanService) { }

  ngOnInit() {
    this.getFilterEntity();
    this.getProviders();
  }

  getFilterEntity() {
    let filterObj = {
      "search": {
        "type": "Competency Area"
      },
      "filter": {
        "isDetail": true
      }
    }
    this.trainingPlanService.getFilterEntity(filterObj).subscribe((res: any) => {
      console.log('entity,', res);
      this.competencyList = res;

    })
  }
  getProviders() {
    this.trainingPlanService.getProviders().subscribe((res: any) => {
      console.log('providers,', res);
      this.providersList = res;
    })
  }

  hideFilter() {
    this.toggleFilter.emit(false)
  }

  checkedProviders(event: any, item: any) {
    if (event) {
      this.selectedProviders.push(item);
      
    } else {
      
    }
  }

  getCompetencyTheme(event: any, ctype: any) {
    console.log('ctype', ctype, this.competencyList, event);
    if (event.checked) {
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          console.log(citem.name, ctype.name, citem.children)
          citem.children.map((themechild: any) => {
            themechild['parent'] = ctype.id;
          })
          this.filterObj['competencyArea'].push(citem.name);
          this.competencyThemeList = this.competencyThemeList.concat(citem.children);
          console.log('competencyThemeList', this.competencyThemeList)
        }
      })
    } else {
      this.competencyThemeList = this.competencyThemeList.filter((sitem) => {
        return sitem.parent != ctype.id
      })
      if (this.filterObj['competencyArea'].indexOf(ctype.id) > -1) {
        const index = this.filterObj['competencyArea'].findIndex((x: any) => x === ctype.id)
        this.filterObj['competencyArea'].splice(index, 1);
      }
    }
    console.log('competencyThemeList', this.competencyThemeList)
  }

  getCompetencySubTheme(event: any, cstype: any) {
    console.log('cstype.parent', cstype.name)
    if (event.checked) {
      this.competencyThemeList.map((csitem: any) => {
        if (csitem.name === cstype.name) {
          csitem.children.map((subthemechild: any) => {
            subthemechild['parentType'] = csitem.parent;
            subthemechild['parent'] = csitem.name;
          })
          this.competencySubThemeList = this.competencySubThemeList.concat(csitem.children);
          this.filterObj['competencyTheme'].push(cstype.name);
        }
      })
    } else {
      this.competencySubThemeList = this.competencySubThemeList.filter((sitem) => {
        return sitem.parent != cstype.name
      })
      if (this.filterObj['competencyTheme'].indexOf(cstype.name) > -1) {
        const index = this.filterObj['competencyTheme'].findIndex((x: any) => x === cstype.name)
        this.filterObj['competencyTheme'].splice(index, 1)
      }
    }
    console.log('this.competencySubThemeList', this.competencySubThemeList);
  }



  manageCompetencySubTheme(event: any, csttype: any) {
    console.log('cstype, event --', event, csttype);
    if(event.checked) {
      this.filterObj['competencySubTheme'].push(csttype.name);
    } else {
      if (this.filterObj['competencySubTheme'].indexOf(csttype.name) > -1) {
        const index = this.filterObj['competencySubTheme'].findIndex((x: any) => x === csttype.name)
        this.filterObj['competencySubTheme'].splice(index, 1)
      }
    }
    
  }

  applyFilter() {
    this.getFilterData.emit(this.filterObj);
    this.toggleFilter.emit(false)
  }
}