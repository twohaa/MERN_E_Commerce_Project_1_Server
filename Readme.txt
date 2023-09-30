# E-commerce MERN-Stack project

/test -> health check (d)

/seed -> sending some data(d)

/api/users (d)
POST /register -> create the user account (d)
POST /activate -> activate the user account (d)
GET /profile -> gte the user account (d)
DELETE /:id -> delete the user account (d)
PUT /:id -> update the user account (d)
PUT /update-password/:id (d) -> update the password
POST /forget-password (d) -> forget the password
PUT /reset password (d) -> reset the password

PUT - Admin /ban/:id (d) -> ban the user
PUT - Admin /unban/:id (d) -> unban the user
GET - Admin /export-users (d) -> export all the users
GET - Admin /all-users -> get all users including search


--> api/auth (JWT Auth)
-> POST /login -> isLoggesOut -> user login (d)
-> POST /logout -> isLoggesIn -> user logout (d)
-> GET /refresh -> get refresh token (d)


--> Middileware
isLoggesIn (d)
isLoggesOut(d)
isAdmin (d)
uploadFile(d)
getRefreshToken (d)
userValidation (d)
runValidation (d)


--> /api/categories (CRUD)
POST / -> create a category (Admin)
GET / -> get all the categories (Admin)
GET /:id -> get single category (Admin)
POST / -> create a category (Admin)
DELETE /:id -> delete a category (Admin)
PUT /:id -> Update a category (Admin)


--> /api/products (CRUD)
POST / -> create a product (Admin)
GET / -> get all the products (Admin)
GET /:id -> get single product (Admin)
POST / -> create a product (Admin)
DELETE /:id -> delete product (Admin)
PUT /:id -> Update a product (Admin)


--> /api/orders (CRUD)
POST / -> create a order (Admin)
GET / -> get all the orders (Admin)
GET /:id -> get single order (Admin)
POST / -> create a order (Admin)
DELETE /:id -> delete order (Admin)
PUT /:id -> Update a order (Admin)


--> api/payment 
GET /token -> get the payment token (User/Admin)
Post /process-payment -> process the payment (User/Admin)



--> packages
npm install express cors http-errors multer body-parser bcrypt jsonwebtoken nodemailer cookie-parser
npm install --save-dev morgan nodemon


--> smpt(google app)
smtp username : mahfuzztwohaa@gmail.com
smpt password : pohyyvmzybjcbrmm



1.Course plan
2.environment setup
3.create express server -> express
4.HTTP request & response
5.nodemon &morgan packages -> nodemon,morgan
6.Api testing with Postman
7.Types of Middleware
8.Express error handaling Middleware -> body-parser
9.Handle HTTP errors -> http-errors
10.How to secure API -> xss-clean , express-rate-limit
11.Environment variable & .gitIgnore
12.MVC architecture
13.Connect to MongoDB
14.Schema and Model for user
15.Create seed route for testing
16.GET /api/users -> isAdmin -> getAllUsers -> serachByName + pagination functionality
17.Response Handler controller for error or success
18.GET /api/users/:id -> get a single user by id
19.How to create services in the backend
20.DELETE /api/users/:id -> delete a single user by id
21.Refactoring & reusability, dynamic
22.Delete Image service
23.POST /api/users/process-register -> process the registration
24.Create JWT
25.Setup smpt server & preapare email
26.send email with nodemailer
27.POST /api/users/verify -> verify + register into database
28.Add multer middleware for file upload
29.Filtering files by size and types
30.Add express validator middleware
31.Should we store image as string or buffer
32.PUT /api/user/:id -> update a single user id
33.POST /api/auth/login -> user login
34.POST /api/auth/logout -> user logout
35.MiddleWares -> isLoggedIn, isLoggedOut, isAdmin
36.input validation when logged in in and refactoring
37.PUT /api/users/ban-user/:id -> ban user
38.PUT /api/users/unban-user/:id -> unban user
39.PUT /api/users/update-password -> update the password
40.POST /api/users/forget-password -> forget the password
41.PUT /api/users/reset-password -> reset the password
42.GET /api/auth/refresh-token -> refresh the token
43.GET /api/auth/protected -> verify the token and give access to other routes
44.refactoring
45.moduler code structure
46.winston logger library
47.Category Model and input validation
48.Category CRUD - Create category -> Post: api/categories/:slug
49.Category CRUD - Read category -> Get: api/categories , Get: api/categories:slug
50.Category CRUD - Update category -> Put: api/categories/:slug
51.Category CRUD - Delete category -> Delete: api/categories/:slug
52.Product Model and input validation
53.Product Api -> create seed routes for testing products
54.Product CRUD - Create product -> Post: api/products/:slug
55.Product CRUD - Read product -> Get: api/products , Get: api/products:slug
56.Product CRUD - Update product -> Put: api/products/:slug
57.Product CRUD - Delete product -> Delete: api/products/:slug
58.Search product -> GET: api/products/
59.
60.






