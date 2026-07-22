import { Component } from '@angular/core';
import { profileIconNames } from './profile-icon-names';

@Component({
  selector: 'con-profile-icon-selector',
  imports: [],
  templateUrl: './profile-icon-selector.componenet.html',
  styleUrl: './profile-icon-selector.componenet.css'
})
export class ProfileIconSelectorComponenet {
  profileIcons = profileIconNames;
  showAllIcons = true;;
  selectedIcon!: string | null;

  iconSelected(icon: string) {
    this.selectedIcon = icon;
    this.showAllIcons = false;
  }
}
