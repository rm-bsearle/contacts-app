import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { phoneTypeValues, addressTypeValues, Address } from '../contacts/contact.model';
import { restrictedWords } from '../validators/restricted-words.validator';
import { DateValueAccessorDirective } from '../date-value-accessor/date-value-accessor.directive';
import { ProfileIconSelectorComponenet } from '../profile-icon-selector/profile-icon-selector.componenet';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateValueAccessorDirective,
    ProfileIconSelectorComponenet,
  ],
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  contactForm = this.fb.nonNullable.group({
    id: '',
    icon: '',
    personal: false,
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>null,
    phones: this.fb.array([this.createPhoneGroup()]),
    addresses: this.fb.array([this.createAddressGroup()]),
    notes: ['', restrictedWords(['foo', 'bar'])],
  });

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;

    this.contactsService.getContact(contactId).subscribe((contact) => {
      if (!contact) return;

      for (let i = 1; i < contact.phones.length; i++) {
        this.addPhone();
      }

      for (let i = 1; i < contact.addresses.length; i++) {
        this.addAddress();
      }

      this.contactForm.setValue(contact);
    });
  }

  private stringifyCompare(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private createPhoneGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false,
    });

    phoneGroup.controls.preferred.valueChanges
      .pipe(distinctUntilChanged(this.stringifyCompare))
      .subscribe((value) => {
        if (value) {
          // can pass an array of validators, or a single one for these functions
          phoneGroup.controls.phoneNumber.addValidators([Validators.required]);
        }
        else {
          phoneGroup.controls.phoneNumber.removeValidators([Validators.required]);
        }
        phoneGroup.controls.phoneNumber.updateValueAndValidity();
      });

    return phoneGroup;
  }

  protected addPhone() {
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  private createAddressGroup() {
    const addressGroup = this.fb.nonNullable.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: '',
    });

    addressGroup.valueChanges
      .pipe(distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for(const controlName in addressGroup.controls) {
          addressGroup.get(controlName)?.removeValidators(Validators.required);
          addressGroup.get(controlName)?.updateValueAndValidity();
        }
      });

    addressGroup.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for(const controlName in addressGroup.controls) {
          addressGroup.get(controlName)?.addValidators(Validators.required);
          addressGroup.get(controlName)?.updateValueAndValidity();
        }
      })

    return addressGroup;
  }

  protected addAddress() {
    this.contactForm.controls.addresses.push(this.createAddressGroup());
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  saveContact() {
    console.log(
      this.contactForm.value.dateOfBirth,
      typeof this.contactForm.value.dateOfBirth,
    );
    this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts']),
    });
  }

  cancelEdit() {
    this.router.navigate(['/contacts']);
  }
}
