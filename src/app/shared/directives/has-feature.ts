import { Directive } from '@angular/core';

@Directive({
  selector: '[appHasFeature]',
})
export class HasFeature {
  constructor() {}
}
