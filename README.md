# Micro CSS

A CSS preprocessor that provides a simplified object orientated approach to css. The syntax is very similar to CSS but encourages better reuse of classes and discourages high [specificity](http://www.htmldog.com/guides/cssadvanced/specificity/).

[![NPM](https://nodei.co/npm/micro-css.png?compact=true)](https://nodei.co/npm/micro-css/)

## BREAKING CHANGES IN v1.0

- element classes are no longer prefixed with `//.` in generated output
- mixins are now prefixed with `_` instead of `$` to avoid escaping in generated output.

## A bit of background

I think there comes a time in any front-end web developer's life when CSS stops being "the most amazing powerful design language on earth" and changes to become the skeletons in our closet that we prefer not to think about too much. This was certainly my experience.

CSS is undoubtedly powerful, but it's too powerful. It encourages you to do things that seem efficient and clever at the time but eventually turn in to absolute maintenance nightmares.

One night I couldn't sleep, I was thinking about the new redesign and how many things would start to break or have to be hacked around to do the new CSS. I realized that I would probably have to completely start again with the CSS on the page. But how should I structure it so that this wouldn't happen again?

I got reading on the internets, trying to find better ways to do it - preprocessors, frameworks, etc. I'd used SASS/SCSS in the past, and while the nesting functions were nice, it was still far too easy to make a mess. I came across [Stubbornella's](http://www.stubbornella.org/) [Object Oriented CSS project](http://oocss.org/). I really liked some of the ideas and concepts. Things like writing for reuse and avoiding specificity. For me OOCSS it wasn't the answer though, it just didn't click for me, so I started to think about how I could twist CSS to be less unwieldy.

I wanted to be able to define objects, but not have to worry about where those objects were on the page. I wanted those objects to have multiple elements but not have those styles spill into other objects. I wanted to be able to add classes to objects as tags/flags - only applying if the object were a particular type. I wanted to be able to create mixins that could be applied to multiple elements, but not used on their own. CSS can do all of these things fairly easy, but it just doesn't encourage it.

So this was the point I realized I was going to have to come up with my own CSS subset that forced these things, but made them far easier to do, and much more manageable/readable. One of my design goals was to make the class attributes in the HTML very easy to understand, using the single class field for assigning object type, meta data flags, and mixins.

## Example

Here's some HTML we want to style:

```html
<html>
  <head>
    <title>HTML5 Rules, but css is still just css...</title>
  </head>
  <body>
    <aside class="Sidebar -mini">
      <header></header>
      <section></section>
      <footer></footer>
    </aside>

    <article class="Page -wide -editable -post">

      <header>
        <h1>Post Title</h1>
        <p>Subtitle</p>
      </header>

      <nav></nav>
      <section>
        <header></header>
      </section>
    </article>

  </body>
</html>
```

And some MCSS to do the styling:

```scss
  Sidebar {
    header {
      font-weight: bold
      color: white
      background: #363
    }
    section {
      header {

      }
      footer {

      }
    }
    footer {

    }
  }

  Page {
    header {

    }
    nav {

    }
    section {

    }
    footer {

    }
  }

  Comment {

  }
```

## It's almost a schema for your HTML

You'll notice that MCSS provides an easy way to view an overall structure of your page. In fact I almost always write the MCSS first to figure out how the page will be laid out then write the HTML to match.

## Installation

```shell
$ npm install micro-css -g
```

## Usage

When installed globally execute:

```shell
$ mcss filepaths... -o outfile.css
```

Or it can be used by API in Node.js:

```js
var microCss = require('micro-css')
var finalCss = microCss("Item { color: red } body { font: 80% sans-serif }")  // read from file or hardcoded like this
```

## Features

### Optional Semicolons

Because semicolons always annoyed me...

### Object classes start with uppercase

The following MCSS:

```scss
Item {
  border: 1px solid gray;
  background: silver;
}
```

Becomes:

```css
.Item {
  border: 1px solid gray;
  background: silver;
}
```

### Good old fashioned element selectors are there - just like normal css

As long as it starts with a lower case letter... otherwise it'll see it as an Object class.

### Nested Rules always use `>`

```scss
Item {
  h1 {
    font-weight: normal
  }
  p {
    margin: 4px 0px
  }
}
```

Becomes:

```css
.Item > h1 {
  font-weight: normal
}
.Item > p {
  margin: 4px 0px
}
```

Makes it not so IE6 friendly, but it's so worth it (then again IE6 doesn't even support multiple classes!)

### If you really have to, you can still opt-out of '>'

```scss
Item {
  (strong) {
    font-weight: bold
    color: #333
  }
}
```

Becomes:

```css
.Item strong {
  font-weight: bold;
  color: #333;
}
```

### Add flags to specific types of objects

```scss
Item {
  color: black
  -special {
    color: red
  }
}
AnotherItem {
  color: black
}
```

Becomes:

```css
.Item {
  color: black;
}
.Item.-special {
  color: red;
}
.AnotherItem {
  color: black;
}
```

```html
<div class='Item'>
  back text
</div>
<div class='Item -special'>
  red text
</div>
<div class='AnotherItem -special'>
  still black text as '-special' is not defined for 'AnotherItem'
</div>
```

So I can use the `-special` flag wherever I like and not worry about stepping on another namespace.

### Specify multiple possibilities [OR]...

```scss
Item {
  -unknown, -disabled{
    color:gray
  }
  -disabled {
    opacity:0.5
  }
}
h1, h2, h3, h4 {
  font-weight: normal
}
```

Becomes:

```css
.Item.-unknown {
  color: gray;
}
.Item.-disabled {
  color: gray;
  opacity: 0.5;
}
h1, h2, h3, h4 { /* this one is left unchanged - one of the few parts that work exactly like standard css */
  font-weight: normal;
}
```

### ... or multiple requirements [AND]

```scss
Listing {
  -featured {
    h1 {
      color: orange
    }
  }
  -sold {
    h1 {
      color: red
    }
  }
  -featured -sold {
    h1 {
      color: green
    }
    opacity: 0.5
  }
}
```

Becomes:

```css
.Listing.-featured > h1{
  color: orange;
}
.Listing.-sold > h1{
  color: red;
}
.Listing.-featured.-sold > h1{
  color: green;
}
.Listing.-featured.-sold{
  opacity: 0.5;
}
```

```html
<div class='Listing -featured'>
  <h1>This text will be orange</h1>
</div>
<div class='Listing -sold'>
  <h1>This text will be red</h1>
</div>
<div class='Listing -sold -featured'>
  <h1>This text will be green</h1>
  And this div will be transparent
</div>
```


### Mixins for reusing a particular style... when Object classes aren't enough

A way to reuse styles in multiple places.

```scss
_fancyThing {
  box-shadow: 10px 10px silver
  div {
    font-size: 90%
  }
}

Item {
  _fancyThing

  border: solid 1px gray
  background-color: fuchsia
}
```

Becomes:

```css
.Item {
  border: solid 1px gray
  background-color: fuchsia
}
._fancyThing, .Item {
  box-shadow: 10px 10px silver;
}
._fancyThing > div, .Item > div {
  font-size: 90%;
}
```

So we can also use the `_mixin` directly as well if we like.

### Element classes - basically how most people currently use classes

Except severely limited so you can't hurt yourself.

```scss
Item {
  color: black
  div.main {
    font-weight:bold
  }
  div.extra {
    color: gray
  }
}
```

Becomes

```css
.Item {
  color: black;
}
.Item > div.main {
  font-weight:bold
}
.Item > div.extra {
  color: gray
}
```

And we can use it like this in our HTML:

```html
<div class='Item'>
  <div class='main'>
    I am some main text
  </div>
  <div>
    I am a standard div
  </div>
  <div class='extra'>
    I am an extra div
  </div>
</div>
```

They can only be used with an element selector, and never on their own. And generally should be avoided if they have a better pure element alternative.

### Inline SVG

```scss
@svg test {
  width: 20px
  height: 20px
  content: "<path d='M0,0 L20,20' />"

  path {
    stroke: #CCC
    stroke-width: 3
    fill: none
  }
}

Item {
  background-image: svg(test)
}
```

Becomes

```css
Item {
  background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bW...)
}
```

The svg is automatically inlined as a data url.

### CSS Entities

```scss
@keyframes animationName {
  from { background-color: red }
  50% { background-color: green }
  to { background-color: blue }
}
```

Becomes

```css
@keyframes animationName {
  from { background-color: red; }
  50% { background-color: green; }
  to { background-color: blue; }
}
```
