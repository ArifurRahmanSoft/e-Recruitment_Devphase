import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { rotate } from '../theme/utils/app-animation';
import { MenuService } from '../theme/components/menu/menu.service';
import { ApiService } from '../api/api.service';
import { MyMenu } from '../api/my_menu';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [ rotate ],
  providers: [ MenuService ]
})
export class PagesComponent implements OnInit { 
  @ViewChild('sidenav') sidenav:any;  
  @ViewChild('backToTop') backToTop:any;  
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public optionsPsConfig: PerfectScrollbarConfigInterface = {};
  public settings:Settings;
  public showSidenav:boolean = false;
  public showInfoContent:boolean = false;
  public toggleSearchBar:boolean = false;
  private defaultMenu:string; //declared for return default menu when window resized 
  public menus = ['vertical', 'horizontal'];
  public menuOption:string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption:string;
  public device:string="lg";

  my_menu_list : MyMenu[];

  constructor(public appSettings:AppSettings, public router:Router, private menuService: MenuService, public _apiService : ApiService){
  

    if(sessionStorage.getItem('isLoggedIn') == 'true'){

    }else {

     this.router.navigate(['/']);
      
    } 
    
   

    this.settings = this.appSettings.settings;
  }
  
  ngOnInit() {
    this.optionsPsConfig.wheelPropagation = false;
    if(window.innerWidth <= 960){
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.device='sm';
    }else{
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
      this.device='lg';
    }

    this.menuOption = this.settings.menu; 
    this.menuTypeOption = this.settings.menuType; 
    this.defaultMenu = this.settings.menu;
  }

  ngAfterViewInit(){   
    debugger
    console.log("scroll controller of pageComponent.ts ",this.pss)  
    setTimeout(() => { 
      this.settings.loadingSpinner = false; 
     
    }, 300); 
    this.backToTop.nativeElement.style.display = 'none'; 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      } 
      if(window.innerWidth <= 960){
        this.sidenav.close(); 
      }                
    });
    //if(this.settings.menu == "vertical")
      //this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems()); 
  }

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public chooseMenu(){
    this.settings.menu = this.menuOption; 
    this.defaultMenu = this.menuOption;
    if(this.menuOption == 'horizontal'){
      this.settings.fixedSidenav = false;
    }
    this.router.navigate(['/']); 
  }

  public chooseMenuType(){
        debugger
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme){
        debugger
    this.settings.theme = theme;       
  }
  
  public closeInfoContent(showInfoContent){
    debugger
    this.showInfoContent = !showInfoContent;
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    debugger
    if(window.innerWidth <= 960){
      this.settings.sidenavIsOpened = false;//previously false
      this.settings.sidenavIsPinned = false;//previously false
      this.settings.menu = 'vertical'
      this.device='sm';
    }
    else{
      (this.defaultMenu == 'horizontal') ? this.settings.menu = 'horizontal' : this.settings.menu = 'vertical'
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
      this.device='lg';
    }
  }

  public onPsScrollY(event){   

    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
  }

  public scrollToTop() {
    console.log("this scrooll top of the button Pages",this.pss)
    debugger
    this.pss.forEach(ps => {
      if(ps.elementRef.nativeElement.id == 'main'){
        ps.scrollToTop(0,250);
      }
    });
  }
  
  public closeSubMenus(){
    if(this.settings.menu == "vertical"){
      //this.menuService.closeAllSubMenus();
    }      
  }










  



  

}