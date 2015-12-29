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

In your page header, make sure you include the plugin like this : 
```html
 <script type="text/javascript" src="bootstrap-form-validator.min.js"></script>
```

In your form tag, add the one of the following instruction to enable the validation :

  a. **real time validation**
```html
<form data-validate="live">
```

  b. **validation on submit**
```html
<form data-validate="true">
```

On each **input** element that need a validation, simply use **data-validate** like this : 
```html
<input type="email" class="form-control" id="email" placeholder="Email" data-validate="required,email">
```

This will tell the validator to make sure the field is not empty( **required** ) and to make sure the value is a valid 
email address( **email** ). Each parameter

> You can use as many rules as you want.

### More examples
```html
<input type="password" class="form-control" id="password" data-validate="required,minlength:8,maxlength:16">
```

```html
<input type="password" class="form-control" id="password2" data-validate="matches:password">
```

```html
<input type="tel" class="form-control" id="phone" data-validate="required,phone_us">
```

```html
<input type="text" class="form-control" id="cc" data-validate="required,creditcard">
```

## Rules

|rule name|optional parameter|description|
|---------|------------------|-----------|
|alpha |none |Input value must contain only letters |
|alphanumeric |none |Input value must contain letters or numbers |
|creditcard |none |Input value must be in a credit card format |
|email|none|Input value must be an email address|
|integer |none |Input value must be an integer |
|matches|Other input field Id|Input value must be the same as the one specified in the other field |
|maxlength|Number|Input value must be at maximum the number of characters specified with the parameter |
|maxsize|String|Only for input type="file". File should not exceed this size. Ex: maxsize=2M |
|minlength|Number|Input value must be at least the number of characters specified with the parameter|
|postalcode_br |none |Input value must be a Brazil postal code |
|postalcode_ca |none |Input value must be a Canada postal code |
|postalcode_uk |none |Input value must be a UK postal code |
|postalcode_us |none |Input value must be a US zip code |
|number |none |Input value must be a number |
|required|none|Input value must not be empty |
|tel |none |Input value must contain numbers and can contain seperators like dot(.), dash(-) or space |
|tel_us |none |Input value must be in the North America phone number format  |
|url |none |Input value must be an url |