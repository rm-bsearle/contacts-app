import { Component, forwardRef, Provider } from '@angular/core';
import { profileIconNames } from './profile-icon-names';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const PROFILE_ICON_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProfileIconSelectorComponenet),
  multi: true,
}

@Component({
  selector: 'con-profile-icon-selector',
  imports: [],
  templateUrl: './profile-icon-selector.componenet.html',
  styleUrl: './profile-icon-selector.componenet.css',
  providers: [PROFILE_ICON_VALUE_ACCESSOR]
})
export class ProfileIconSelectorComponenet implements ControlValueAccessor {
  profileIcons = profileIconNames;
  showAllIcons = true;;
  selectedIcon!: string | null;

  private onChange!: Function;
  private onTouched!: Function;

  writeValue(icon: string | null): void {
    this.selectedIcon = icon;
    if (icon && icon !== '') {
      this.showAllIcons = false;
    } else {
      this.showAllIcons = true
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = (icon: string) => { fn(icon) };
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }


  iconSelected(icon: string) {
    this.selectedIcon = icon;
    this.showAllIcons = false;
    this.onChange(icon);
  }
}
