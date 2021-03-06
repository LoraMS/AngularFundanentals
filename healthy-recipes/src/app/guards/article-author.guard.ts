import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

import { ArticlesService } from './../services/articles.service';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ArticleAuthorGuard implements CanActivate {
    public userId;

    constructor(
        private router: Router,
        private articleData: ArticlesService,
        private toastr: ToastrService,
        private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
            const id = route.params['id'];
            this.userId = localStorage.getItem('authkey');
            return this.articleData.getAtricleById(id).valueChanges()
                     .take(1)
                     .map((a) => {
                        return a.userId === this.userId;
                     })
                     .do(authorized => {
                       if (!authorized) {
                        this.toastr.error('You have no permissions to make this changes!', 'Error!');
                        this.router.navigate(['/articles']);
                       } else {
                           return true;
                       }
                     });
      }
}

