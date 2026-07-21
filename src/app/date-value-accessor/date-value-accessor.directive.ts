import { Directive, ElementRef, forwardRef, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true,
};

@Directive({
  selector: 'input([type=date])[formControlName], input([type=date)[formControl], input([type=date])[ngModel]',
  providers: [DATE_VALUE_PROVIDER]
})
export class DateValueAccessorDirective implements ControlValueAccessor {

  constructor(private element: ElementRef) { }

  writeValue(newValue: Date): void {
    if(newValue instanceof Date) {
      this.element.nativeElement.value = newValue.toISOString().split('T')[0];
    }
  }

  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }

}
