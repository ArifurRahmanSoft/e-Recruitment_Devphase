import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { map, catchError } from 'rxjs/operators';

import { ApiConst } from './api.baseurlconst.service';
import { Conversion } from './api.conversion.service';

import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
     providedIn: 'root'
})
export class DataService {


     private oidSource = new BehaviorSubject<{ oid: string, masterDiv: boolean, applyForm: boolean } | null>(null);
     oid$ = this.oidSource.asObservable();

     setOid(oid: string, masterDiv: boolean, applyForm: boolean) {
          this.oidSource.next({ oid, masterDiv, applyForm });
     }

     private callProfileFunctionSource = new Subject<any>();
     callProfileFunction$ = this.callProfileFunctionSource.asObservable();

     callProfileFunction(data: any) {
          this.callProfileFunctionSource.next(data);
     }





     public appSettings: any;
     public _apiHost: any;
     public apiHost: string;
     public _conversion: any;
     public _userId: any;
     private _domSanitizer: DomSanitizer;
     //imageAPI:string = 'http://localhost:49942/api/'

     constructor(private _http: HttpClient, @Inject(DOCUMENT) private document: any) {
          this.appSettings = new AppSettings();
          this._conversion = new Conversion(this.appSettings, this._domSanitizer);
          this._apiHost = new ApiConst();
          this.apiHost = this._apiHost.autohost(this.document.location);

          var loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
          this._userId = loggedUser != null ? loggedUser.userId : '0000';
     }

     getall(_apiRout: string) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     getbyid(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     delete(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     deleteById(_apiRout: string, id: string) {
          const url = this.apiHost + _apiRout + '?id=' + id;
          let _headers = new HttpHeaders()
               .set('Content-Type', 'application/json; charset=utf-8')
               .append('userId', this._userId);

          return this._http.put(url, {}, { headers: _headers }) // <-- Use PUT with empty body
               .pipe(map((res: any) => res))
               .pipe(catchError(this.handleError));
     }



     getWithMultipleModel(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     postMultipleModel(_apiRout: string, model: any) {
          debugger
          let body = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.post(_apiRout, body, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     postMultipleModelForm(_apiRout: string, model: any, formModel: any) {
          let body = this._conversion.JsonStringify(model);
          formModel.append('data', body);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     postForm(_apiRout: string, formModel: any) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     deleteWithMultipleModel(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     getWithMultipleModelPDF(_apiRout: string, model: any): any {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers, responseType: 'blob' })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError));
     }

     //Synchronous request
     getall_Sync(_apiRout: string) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     getbyid_Sync(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     delete_Sync(_apiRout: string, id: string) {
          _apiRout = this.apiHost + _apiRout + '?id=' + id
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     getWithMultipleModel_Sync(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();

     }

     postMultipleModel_Sync(_apiRout: string, model: any) {
          let body = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.post(_apiRout, body, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     deleteWithMultipleModel_Sync(_apiRout: string, model: any) {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.delete(_apiRout, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     getWithMultipleModelPDF_Sync(_apiRout: string, model: any): any {
          let qString = this._conversion.JsonStringify(model);
          _apiRout = this.apiHost + _apiRout + '?param=' + qString;
          let _headers = new HttpHeaders();
          _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', this._userId);;
          return this._http.get(_apiRout, { headers: _headers, responseType: 'blob' })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     postMultipleModelForm_Sync(_apiRout: string, model: any, formModel: any) {
          debugger
          let body = this._conversion.JsonStringify(model);
          formModel.append('data', body);
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     postForm_Sync(_apiRout: string, formModel: any) {
          _apiRout = this.apiHost + _apiRout;
          let _headers = new HttpHeaders();
          _headers = _headers.set('userId', this._userId);
          return this._http.post(_apiRout, formModel, { headers: _headers })
               .pipe(map((res: any) => { return res; }))
               .pipe(catchError(this.handleError)).toPromise();
     }

     private handleError(error: Response) {
          return (error.toString() || 'Opps!! Server error');
     }



     uploadFile(fileCollection: FileList, url: any): Observable<any> {
          const formData = new FormData();
          //var url="reqform/dbsinleuploadfile"
          for (let i = 0; i < fileCollection.length; i++) {
               formData.append('fileCollection', fileCollection[i], fileCollection[i].name);
          }
          //return this._http.post<any>(`${this.apiHost}reqform/dbsinleuploadfile`, formData);
          return this._http.post<any>(`${this.apiHost}${url}`, formData);
     }



     updateFile(documentId: number, fileCollection: FileList, url: string): Observable<any> {
          const formData = new FormData();

          for (let i = 0; i < fileCollection.length; i++) {
               formData.append('fileCollection', fileCollection[i], fileCollection[i].name);
          }

          const fullUrl = `${this.apiHost}${url}/${documentId}`;
          return this._http.post<any>(fullUrl, formData);
     }






     getImage(documentPath: string, _imgUrl: string): Observable<Blob> {
          debugger
          return this._http.get(`${this.apiHost}${_imgUrl}/${documentPath}`, { responseType: 'blob' });
     }

     //start share data
     private storageKey = 'masterListId';
     setMasterListId(id: string) {
          localStorage.setItem(this.storageKey, id);
     }
     getMasterListId(): string {
          return localStorage.getItem(this.storageKey);
     }
     clearMasterListId() {
          localStorage.removeItem(this.storageKey);
     }

     downloadFile(apiRout: string, filePath: string) {
          apiRout = this.apiHost + apiRout;
          const url = `${apiRout}/${encodeURIComponent(filePath)}`;
          return this._http.get(url, {
               responseType: 'blob', // important for file
               observe: 'response'   // to extract filename
          });
     }

     //SHARED SERVICE 
     private email: string = '';
     private otp: string = '';

     setEmail(email: string) {
          this.email = email;
     }

     setOTP(otp: string) {
          this.otp = otp;
     }

     getEmail(): string {
          return this.email;
     }

     getOTP(): string {
          return this.otp;
     }

     //last one

   

   

       uploadAllFile(files: any[], url: string, referenceId: string): Observable<any> {
          debugger
          const formData = new FormData();
          files.forEach((item, index) => {
               formData.append('fileCollection', item.attachedfile);
               formData.append(`docId[${index}]`, item.docId);
               formData.append(`fileType[${index}]`, item.fileType); 
          });

          formData.append('referenceId', referenceId);

          return this._http.post<any>(`${this.apiHost}${url}`, formData);
     }

           uploadAllFilez(files: any[], url: string, referenceId: string,type:string): Observable<any> {
          debugger
          const formData = new FormData();
          files.forEach((item, index) => {
               formData.append('fileCollection', item.attachedfile);
               formData.append(`docId[${index}]`, item.docId);
               formData.append(`fileType[${index}]`, item.fileType); 
          });

          formData.append('referenceId', referenceId);
          formData.append('type', type);

          return this._http.post<any>(`${this.apiHost}${url}`, formData);
     }





     
   //TEST CASE FOR ANGULAR
insertUser(model: any,apiUrl:string): Observable<any> {
     debugger
     var _apiRout = this.apiHost + apiUrl;
         let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
 

  return this._http.post<any>(_apiRout, model,{headers});
}





}

