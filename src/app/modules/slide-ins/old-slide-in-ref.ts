import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @deprecated Use `SlideIn` and `SlideInRef` instead.
 */
export class OldSlideInRef<T, D = unknown> {
  readonly slideInClosed$ = new Subject<D>();
  componentRef: ComponentRef<T>;
  id: string;

  get componentInstance(): T {
    return this.componentRef.instance;
  }

  close(response?: D): void {
    this.slideInClosed$.next(response);
    this.slideInClosed$.complete();
  }
}
