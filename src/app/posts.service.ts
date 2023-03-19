import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  error = new Subject<string>();

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://angular-learning-712bf-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(reponseData => {
        console.log(reponseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-learning-712bf-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {

          /// send to anylitics
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
   return this.http.delete('https://angular-learning-712bf-default-rtdb.firebaseio.com/posts.json')
  }
}
