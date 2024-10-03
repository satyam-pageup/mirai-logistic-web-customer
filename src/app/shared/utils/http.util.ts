import { Observable } from "rxjs";

export function UseFetch<R>(ob: Observable<R>): Promise<R> {
    const postPromise = new Promise<R>((resolve, reject) => {
        ob.subscribe({
            next: (res) => {
                resolve(res);
            },
            error: (err) => {
                reject(err);
            }
        })
    });
    return postPromise;
}