import { observable,action, autorun,reaction} from "mobx";
import { observer,disposeOnUnmount} from 'mobx-react'
import { autobind } from "../../utils";
import { TetantDepartment, tetantDepartmentApi } from "../../api/endpoints/tenant-department.api";
import { ItemStore } from "../../item.store";
import flatten from "lodash/flatten"

@autobind()
export class DepartmentStore extends ItemStore<TetantDepartment> {

    @observable deptName:string

 
    @action
    changeItemName(name:string){
      this.deptName = name
    }

    @action
    clean(){
      this.deptName = ''
    }

    loadAll() {
      return this.loadItems(() => tetantDepartmentApi.list());
    }

    getByName(name: string, repo: string) {
      return this.items.find(item => item.getName() === name);
    }

    async removeSelectedItems(){
      console.log('---------delete',this.selectedItems)
    }
}


export const departmentStore = new DepartmentStore();
