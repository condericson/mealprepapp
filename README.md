# Prepper

A meal preparation application designed to assist with organizing meals on a weekly basis, provide search results using keywords from Yummly's API for recipes that can be added to the weekly view, to allow users to upload their own recipes to the weekly view, and to create a grocery list using the ingredients of the recipes in the week for ease of shopping.

This was created as a capstone project, part of Thinkful flexible bootcamp program (https://www.thinkful.com/), for demonstrating proficiency with creating full-stack web applications.

## Desktop

![Screenshots](https://github.com/condericson/mealprepapp/blob/master/readme_images/desktop.png)

## Responsive

![Screenshots](https://github.com/condericson/mealprepapp/blob/master/readme_images/responsive.png)


## Description
Prepper provides a user specific experience by requiring login credentials and saving recipes created or added to specific users. The user is able to add their own recipes to the database through a recipe entry modal or they can search through results provided by an API from Yummly to add pre-made recipes. The site can be viewed on a desktop as well as on a small device such as an ipad or phone. Functionality is changed based on the size of the display and method of interface: touch or click.

## Live Site
You can access Prepper on the live site at: https://prepper-condericson.herokuapp.com


## Version 2.0 changes and added functionality:
* Provide option for users to upload their own images to user created recipes
* Add checkboxes for grocery list modal
* Increase security for user passwords


## Technical
* The app is built using HTML5, CSS3, Javascript with jQuery, Node.js, and MongoDB, and tests with Mongoose and Chai.
* The app is fully responsive, adapting for mobile, tablet, and desktop viewports.
* The app gathers information through an API from Yummly.