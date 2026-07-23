import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class RolepermissionService {
  constructor(private api:Api){}
  getRolepermissions(){
    return this.api.GET('RolePermission');
  }
  getRolepermissionById(id:number){
    return this.api.GET(`RolePermission/${id}`);
  }
  createRolepermission(data:any){
    return this.api.POST('RolePermission/assign',data);
  }
  updateRolepermission(id:number,data:any){
    return this.api.PUT(`RolePermission/${id}`,data);
  }
  deleteRolepermission(id:number){
    return this.api.DELETE(`RolePermission/${id}`);
  }
}
