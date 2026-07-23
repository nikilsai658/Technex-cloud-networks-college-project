import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private api:Api){}
  getPermissions(){
    return this.api.GET('Permission');
  }
  getPermissionById(id:number){
    return this.api.GET(`Permission/${id}`);
  }
  createPermission(data:any){
    return this.api.POST('Permission',data);
  }
  updatePermission(id:number,data:any){
    return this.api.PUT(`Permission/${id}`,data);
  }
  deletePermission(id:number){
    return this.api.DELETE(`Permission/${id}`);
  }
}
