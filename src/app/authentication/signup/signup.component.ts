import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UsersService } from '../../services/users.service';

import { mimeType } from '../../shared/mime-type.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  form: FormGroup;
  protected imagePreview: string;
  // tslint:disable-next-line:quotemark
  strongRegex: RegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  constructor(public userService: UsersService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(3),
        // tslint:disable-next-line:quotemark
        Validators.pattern("^[a-zA-Z ]{3,30}$")
      ]}),
      dob: new FormControl(null, {validators: [
        Validators.required
        // tslint:disable-next-line:max-line-length quotemark
        // Validators.pattern("^\d{2}[.\/-]\d{2}[.\/-]\d{4}$")
      ]}),
      email: new FormControl(null, {validators: [
        Validators.required,
        // tslint:disable-next-line:max-line-length quotemark
        Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]}),
      password: new FormControl(null, {validators: [
        Validators.required,
        Validators.pattern(this.strongRegex)
      ]}),
      cpassword: new FormControl(null, {validators: [
        Validators.required,
        Validators.pattern(this.strongRegex)
      ]}),
      phone: new FormControl(null, {validators: [
        Validators.required
      ]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      tagline: new FormControl(null, {validators: [
        Validators.required,
        // tslint:disable-next-line:quotemark
        Validators.pattern("^[0-9a-zA-Z!.&:?@,\'\"() ]{3,60}$")
      ]}),
      content: new FormControl(null, {validators: [
        Validators.required,
        // tslint:disable-next-line:quotemark
        Validators.pattern("^[0-9a-zA-Z!.&:?@,\'\"() ]{100,}$")
      ]})
    });
  }

  onImagePicker(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveUser() {
    // tslint:disable-next-line:max-line-length
    if (this.form.invalid || (this.form.value.password !== this.form.value.cpassword) || !this.strongRegex.test(this.form.value.password)) {
      return;
    }
    this.isLoading = true;
    const user = {
      name: this.form.value.name,
      dob: this.form.value.dob,
      email: this.form.value.email,
      password: this.form.value.password,
      phone: this.form.value.phone,
      image: this.form.value.image,
      tagline: this.form.value.tagline,
      content: this.form.value.content
    };
    this.userService.createUser(user);
  }

}
