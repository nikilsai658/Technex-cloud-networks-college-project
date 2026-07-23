import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private api:Api){}
  getRoles(){
    return this.api.GET('Role');
  }
  getRoleById(id:number){
    return this.api.GET(`Role/${id}`);
  }
  createRole(data:any){
    return this.api.POST('Role',data);
  }
  updateRole(id:number,data:any){
    return this.api.PUT(`Role/${id}`,data);
  }
  deleteRole(id:number){
    return this.api.DELETE(`Role/${id}`);
  }
}
