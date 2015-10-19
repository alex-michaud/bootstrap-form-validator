# bootstrap-form-validator
Bootstrap plugin to validate a form

**This Bootstrap plugin have been tested with Bootstrap 3.**

**It is not compatible with Bootstrap 2.**

**I'm planning to maintain compatibility with Bootstrap 4.**

## Installation

To install the plugin, simply copy the __bootstrap-form-validator.js__ file into your project Javascript folder.
Also, copy the language files that you need in the same directory. 

## Language files

The language file have this naming structure : __bootstrap-form-validator-{language}.js__ 
For example : __bootstrap-form-validator-en.js__

If you need a language file that is not in the list, please contact me and I'll try to create it for you.
Or even better, create your own language file from one of the existing one and send it over here.

## Usage

1. In your page header, make sure you include the plugin like this : 
```html
 <script type="text/javascript" src="bootstrap-form-validator.min.js"></script>
```
2. In your form tag, add the one of the following instruction to enable the validation :
    1. **real time validation**
```html
<form data-validate="live">
```
    2. 
  **validation on submit**
```html
<form data-validate="true">
```

3. On each **input** element that need a validation, simply use **data-validate** like this : 
```html
<input type="email" class="form-control" id="email" placeholder="Email" data-validate="required,email">
```
This will tell the validator to make sure the field is not empty(**required**) and to make sure the value is a valid 
email address(**email**).

> You can use as many rules as you want.

### More examples
```html
<input type="password" class="form-control" id="password" placeholder="Password" data-validate="required,minlength:8,maxlength:16">
```
```html
<input type="password" class="form-control" id="password2" placeholder="Confirm password" data-validate="matches:password">
```
```html
<input type="tel" class="form-control" id="phone" placeholder="Phone" data-validate="required,phone_us">
```
```html
<input type="text" class="form-control" id="cc" placeholder="Credit card" data-validate="required,creditcard">
```
