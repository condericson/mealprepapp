

# Dinner Plans
[Dinner Plans] is a meal preparation application designed to assist with organizing meals on a weekly basis, provide search results using keywords from Yummly's API for recipes that can be added to the weekly view, to allow users to upload their own recipes to the weekly view, and to create a grocery list using the ingredients of the recipes in the week for ease of shopping.

![screenshots](https://github.com/condericson/mealprepapp/blob/master/readme_images/desktop.png "Screenshots")

## About
[Dinner Plans] provides a user specific experience by requiring login credentials and saving recipes created or added to specific users. The user is able to add their own recipes to the database through a recipe entry modal or they can search through results provided by an API from Yummly to add pre-made recipes. The site can be viewed on a desktop as well as on a small device such as an ipad or phone. Functionality is changed based on the size of the display and method of interface: touch or click.

![mobile screenshots](https://github.com/condericson/mealprepapp/blob/master/readme_images/responsive.png "Mobile Screenshots")

This application combines the use of the Javascript with jQuery on the front end with Node.js and MongoDB on the back end.

## Getting started
### `Install`
```
>   git clone https://github.com/condericson/meal-prep-app.git
>   cd meal-prep-app
>   npm install
```
### `Launch`
```
>   npm run start
```
Then open [`localhost:3000`](http://localhost:3000) in a browser.
### `Test`
```
>   npm test
```



## Technology
### Front End
* HTML5
* CSS3
* Javascript
* jQuery


### Back End
* Node.js
* MongoDB
* [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)

### Tests
* Mocha
* Chai

## Version 2.0 changes and added functionality:
Applications can always improve upon themselves. Areas in which [Dinner Plans] can improve are:
* Provide option for users to upload their own images to user created recipes.
* Add check boxes for grocery list modal.
* Create 404 page for navigating to a page that doesn't exist.
* Provide more feedback for users for incorrect inputs (i.e. already existing usernames).
* Provide responsive styling for landscape view on mobile device.


## Credits
Photos from [Pexels](https://www.pexels.com/) and other graphics obtained under the [Creative Commons Zero (CC0) license](https://www.pexels.com/photo-license/)
Recipe information gathered from [Yummly](http://www.yummly.com/) API.


[Dinner Plans]: <https://prepper-condericson.herokuapp.com>
