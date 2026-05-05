# Stripe Integration Examples
---

## This Site
This site is where I build and share examples of Stripe elements integrations.  For each integration, I share examples of both front-end and back-end code.  My site is using [Nuxt 4][def1] and [Nuxt Content][def2] to build a document driven approach to rendering content and displaying Stripe integrations. Because of this, the code run by this site is not exactly the same as the code displayed but I wanted to provide the most straight forward examples to get people started and make it easy to understand.

## Integrations
The integrations presented here attempt to cover both many common use cases and popular Stripe Elements as well as some interesting edge cases.  Where applicable, I will include additionald details and callouts to specific text in the Stripe docs that is easy to overlook or produces behavior that may be unexpected.  

This is not an exhaustive list and no one should rely purely on these examples for how to build Stripe integrations.  The [Stripe docs][def3] are still the autoritative source for guides on integrating Stripe products.  I just think it's fun to build some examples and share them with people.

## Code
You can find the actual code that runs this site at the following repository: https://github.com/supermanzer/stripe.supermanzer.io

This code differs from what is presented on each integration page.  For the integration examples I am trying to provide the simplest code I can.  For this site, I am attempting to make use of composable functions and managing state in a way that makes it easy to add new integrations and provide the user interfaces I'm designing.  

The examples I'm creating are to share some examples of integrating Stripe.  I hope other people find them useful and interesting.  The code that powers them is a learning process for me to better understand how to construct web applications with a high degree of user interactions and shared state.  I find that interesting to reason through.  So 🤞 everyone is learning something!

## Inspiration
This site was inspired by the brilliant work of my colleagues (current and former). You can see their genius and admire the different takes each of us has on web design by checking out [4242.io][def4] and [stripe.erintalyor.dev][def5].  

There are similarities and differences with how each of those sites present similar examples to what you will find here.  But, after spending more than a decade teaching myself various tech topics by reading websites, I have learned that even slight changes to how content is packaged and presented can resonate more or less for different people.  So, even though much of what I do here will be duplicative of examples shown on the other two sites I mentioned, I will present my own version in the hope that it will help these ideas click.


[def1]: https://nuxt.com/
[def2]: https://v2.content.nuxt.com/document-driven/introduction
[def3]: https://docs.stripe.com/
[def4]: https://4242.io/test/
[def5]: https://stripe.erintaylor.dev