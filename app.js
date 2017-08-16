var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var mongoose = require('mongoose');
var acl = require('acl');
var schedule = require('node-schedule');
var Schema = mongoose.Schema;
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
// var webpackConfig = require('./webpack.config.dev');
 var webpackConfig = require('./webpack.prod.config');

var UsersModel = require('./model/user');
var Accounts = require('./model/admin');
var Campaigns = require('./model/campaigns');
var Contacts = require('./model/contacts');
var Recurring = require('./model/recurring');
var TeamModel = require('./model/team');
var Tasks = require('./model/tasks');
var Post = require('./model/post');
var Activity = require('./model/activity');
var Project = require('./model/project');
var Milestone = require('./model/milestone');
var LogCall = require('./model/logacall');
var PMTModel = require('./model/projectmilestonetasks');
var pmtpostModel = require('./model/pmtpost');
var PMTlogacall = require('./model/PMTlogacall');


mongoose.promise = global.Promise;

// mongoose.connect('mongodb://localhost/crm-psg', function(error, db){
// 	var mongoBackend = new acl.mongodbBackend(db, 'acl_');
// });

mongoose.connect('mongodb://aiofe:123456@ds131099.mlab.com:31099/psg-crm', function(error, db){
	var mongoBackend = new acl.mongodbBackend(db, 'acl_');
});

var db = mongoose.connection;

//admin dashboard
var Users = require('./routes/users');
var routes = require('./routes/index');
var admin = require('./routes/admin');
var project = require('./routes/project');
var leadsRoutes = require('./routes/leads');
var contactRoutes = require('./routes/contacts');
var opportunityRoutes = require('./routes/opportunity');
var AccountsRoutes = require('./routes/accounts');
var CampaignRoutes = require('./routes/campaigns');
var MilestoneTaskRoutes = require('./routes/milestonetask');
var AccountUserRoutes = require('./routes/account_user');
var MilestoneRoutes = require('./routes/milestone');
var TasksRoutes = require('./routes/tasks');
var ProfileRoutes = require('./routes/profile');
var SaleViewRoutes = require('./routes/saleview');
var ServiceViewRoutes = require('./routes/serviceview');
var WorkViewRoutes = require('./routes/workview');
var ProjectViewRoutes = require('./routes/projectview');
var WorkPulsRoutes = require('./routes/workpuls');

//employee dashboard
var employee = require('./routes/employee/home');
var profile = require('./routes/employee/user_profile');
var accountsRoutes = require('./routes/employee/accounts');

//manager dashboard
var PanelRoutes = require('./routes/manager/panel');

//init app
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(webpackMiddleware(webpack(webpackConfig)))

// io.on('connection', function(socket){
// 	socket.on('send message', function(data){
// 		io.sockets.emit('new message', data);
// 		app.get(function(req,res){
// 			console.log(req.user.username);
// 		});
// 	});
// });

var hbs = exphs.create({
	extname: 'handlebars',
    defaultLayout: 'layouts/layout', 
    //helpers      : helpers,
    partialsDir: __dirname + '/views/partials/',
    layoutsDir: __dirname + '/views/',
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// app.set('view engine', 'jsx');
// app.engine('jsx', require('express-react-views').createEngine());

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'uploads')));

//express session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(expressValidator({
	errorFormater: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespance.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namepsace.shift() + ']';
		}
		return {
			param: formParam,
			msg : msg,
			value: value
		};
	}
}));

//conect flash
app.use(flash());

//global vars
app.use(function( req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//find all data in recurrring table

var apiRecurring =  app.get('/admin/recurring/api', function(req,res){
	Recurring.find({})
		.exec()
		.then((recurring) => {
			console.log(recurring);
			res.json(recurring);
		})
		.catch((err) => {
			res.send("error occured");
		});
});


//find by ID  recurring 

app.get('/admin/recurring/api/:id' , function(req,res){
	Recurring.findOne({
		_id:req.params.id
	})
	.exec()
	.then((recurring) => {
		console.log(recurring);
		res.json(recurring);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

app.get('/user/api',function(req,res){
	res.send(req.user);
});

//find all data in User table

app.get('/admin/users/api', function(req,res){
	UsersModel.find({})
		.exec()
		.then((users) => {
			console.log(users);
			res.json(users);
		})
		.catch((err) => {
			res.send("error occured");
		});
});

//find one data in Users table

app.get('/admin/users/api/:id' , function(req,res){
	UsersModel.findOne({
		_id:req.params.id
	})
	.exec()
	.then((users) => {
		console.log(users);
		res.json(users);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//update user info
app.put('/admin/users/api/:id', function(req,res){
	UsersModel.findByIdAndUpdate({
		_id:req.params.id
	},
		{ 
			$set: 
				{ 
					fullname: req.body.fullname,
					email: req.body.email,
					position: req.body.position,
					description: req.body.description,
					address: req.body.address,
					city: req.body.city,
					country: req.body.country,
					about: req.body.about
				 },

		},
		{ upsert: true },
		function(err, newUser){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(newUser);
				res.send(newUser);
				//res.status(204);
			}
	});
});

//find all users by populate

app.get('/admin/user/merge/api', function(req,res){
	UsersModel.find({})
		.populate('team','team_name')
		.populate('account','account_name')
		.exec(function(err,results){
			res.send(results);
		});
});

// find all users by account

app.get('/admin/user/merge/account/api/:account_name', function(req,res){
	UsersModel.find({account: req.params.account_name})
		.populate('team','team_name')
		.populate('account','account_name')
		.exec(function(err,results){
			res.send(results);
		});
});

// find all activity

app.get('/admin/activity/api', function(req,res){
	Activity.find({})
		.exec()
		.then((activity) => {
			console.log(activity);
			res.json(activity)
		})
		.catch((err) => {
			res.send("error occured");
		});
});

// find all data in log a call account

app.get('/admin/logacall/api/:account_id', function(req,res){
	LogCall.find({account:req.params.account_id})
		.sort({date_created: -1})
		.populate('account')
		.populate('created_by')
		.populate('assigned')
		.exec(function(err,results){
			res.json(results);
		})
});

// find one log a  call data

app.get('/admin/logacall/api/merge/:id', function(req,res){
	LogCall.findOne({_id:req.params.id})
		.sort({date_created: -1})
		.populate('account')
		.populate('created_by')
		.exec(function(err,results){
			res.json(results);
		})
});

//find all project data

app.get('/admin/project/api', function(req,res){
	Project.find({})
		.exec()
		.then((project) => {
			console.log(project);
			res.json(project)
		})
		.catch((err) => {
			res.json('Error occured');
		})
});

// find all project populate

app.get('/admin/project/merge/api', function(req,res){
	Project.find({})
		.populate('account')
		.populate('created')
		.exec(function(err,results){
			res.json(results);
		});
});

// find all project completed

app.get('/admin/project/complete/api', function(req,res){
	Project.find({status:'Completed'})
		.exec()
		.then((project) => {
			console.log(project);
			res.json(project)
		})
		.catch((err) => {
			res.json('error occured');
		})
});

// find project by ID

app.get('/admin/project/merge/api/:id', function(req,res){
	Project.findById({_id:req.params.id})
		.populate('account')
		.populate('created')
		.exec(function(err,results){
			res.json(results);
		});
});

// find all project by account

app.get('/admin/project/api/:account_id', function(req,res){
	Project.find({account:req.params.account_id})
		.exec()
		.then((project) => {
			console.log(project);
			res.json(project)
		})
		.catch((err) => {
			res.send("error occured");
		});
});

// find all project and populate by account

app.get('/admin/account/merge/project/api/:account_id', function(req,res){
	Project.find({account:req.params.account_id})
		.sort({dateCreated: -1})
		.populate('account')
		.populate('created')
		.exec()
		.then((project) => {
			console.log(project);
			res.json(project)
		})
		.catch((err) => {
			res.send("error occured");
		});
});

//find all PMT

app.get('/admin/pmt/api', function(req,res){
	PMTModel.find({})
		.populate('account')
		.populate('created_by')
		.populate('assigned')
		.populate('project')
		.populate('milestone')
		.exec()
		.then((pmt) => {
			console.log(pmt);
			res.json(pmt);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//find PMT by ID

app.get('/admin/pmt/api/:id', function(req,res){
	PMTModel.find({_id:req.params.id})
			.populate('account')
			.populate('assigned')
			.populate('milestone')
			.populate('project')
			.populate('created_by')
			.exec()
			.then((pmt) => {
				console.log(pmt);
				res.json(pmt);
			})
			.catch((err) => {
				res.send('error occured');
			});
});

// find all task by milestone

app.get('/admin/milestone/pmt/api/:milestone_id', function(req,res){
	PMTModel.find({milestone:req.params.milestone_id})
		.populate('account')
		.populate('assigned')
		.populate('project')
		.populate('milestone')
		.populate('created_by')
		.exec()
		.then((milestone) => {
			console.log(milestone);
			res.json(milestone);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

// find all task by project

app.get('/admin/milestone/project/pmt/api/:project_id', function(req,res){
	PMTModel.find({project:req.params.project_id})
		.sort({date_created: -1})
		.populate('project', 'project_name')
		.populate('account','account_name')
		.populate('assigned', 'fullname')
		.populate('milestone','milestone_name')
		.populate('created_by')
		.exec()
		.then((milestoneTask) => {
			console.log(milestoneTask);
			res.json(milestoneTask);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//find all complete task from a project

app.get('/admin/project/taskcompleted/api/:project_id', function(req,res){
	PMTModel.find({project:req.params.project_id})
			.where('status').equals('5')
			.exec()
			.then((task) => {
				console.log(task);
				res.json(task);
			})
			.catch((err) => {
				res.send('error occured');
			})
});

//find all milestone

app.get('/admin/milestone/api/', function(req,res){
	Milestone.find({})
		.populate('project')
		.populate('account')
		.populate('created_by')
		.exec()
		.then((milestone) => {
			console.log(milestone);
			res.json(milestone);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//populate milestone data by project ID

app.get('/admin/milestone/merge/project/api/:project_id', function(req,res){
	Milestone.find({project:req.params.project_id})
		.sort({kick_start : 1})
		.populate('account')
		.populate('project')
		.exec(function(err,results){
			res.json(results);
		});
});

//populate milestone data by account

app.get('/admin/milestone/merge/api/:account_id', function(req,res){
	Milestone.find({account:req.params.account_id})
		.populate('account')
		.populate('project')
		.exec(function(err,results){
			res.json(results);
		});
});

//populate Milestone by ID

app.get('/admin/milestone/merge/data/api/:id', function(req,res){
	Milestone.findById({_id:req.params.id})
		.populate('account')
		.populate('project')
		.populate('created_by')
		.exec(function(err,results){
			res.json(results);
		});
});

///delete mllestone

app.delete('/admin/delete_milestone/:id', function(req,res){
	Milestone.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((milestone) => {
		console.log(milestone);
		res.json(milestone);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//populate activity data

app.get('/admin/activity/merge/api/:account_id', function(req,res){
	Activity.find({account:req.params.account_id})
		.populate('account')
		.populate('created_by')
		.exec(function(err,results){
			res.json(results);
		});
});

//Find all post data

app.get('/admim/post/api', function(req,res){
	Post.find({})
		.exec()
		.then((post) => {
			console.log(post);
			res.json(post);
		})
		.catch((err) => {
			res.send("error occured");
		});
});

// populate data
app.get('/admin/post/merge/api', function(req,res){
	Post.find({})
		.populate('account')
		.populate('user')
		.exec(function(err,results){
			res.send(results);
		});
});

// populate data by account
app.get('/admin/post/merge/api/:account_id', function(req,res){
	Post.find({account:req.params.account_id})
		.sort({dateCreated: -1})
		.populate('account')
		.populate('user')
		.exec(function(err,results){
			res.send(results);
		});
});


//show task by account

app.get('/admin/tasks/merge/api/accounts/:account_id', function(req,res){
	Tasks.find({account:req.params.account_id})
		.sort({date_created : -1})
		.populate('account')
		.populate('assigned')
		.populate('created_by')
		.exec(function(err,results){
			res.send(results);
		})
});

//populate user - account - team

app.get('/admin/user/merge/api/:user_id', function(req,res){
	var user_id = req.params.user_id;
	UsersModel.findById({_id:user_id})
		.populate('team','team_name')
		.populate('account','account_name')
		.exec(function(err,results){
			res.send(results);
		});
});

//get one account
app.get('/admin/accounts/show_team/api/merge/:account_id', function(req,res){
	var account_id = req.params.account_id;
	Accounts.findById(account_id).exec(function(err,account){
		res.json(account);
	});
});


//update team
app.put('/admin/edit_user', function(req,res){
	var obj = {};
	var team = req.body.team;
	var account = req.body.account;
	var user_id = req.body.user_id;
	var role = req.body.role;

	UsersModel.findByIdAndUpdate({
		_id:user_id
	},
		{ 
			$set: 
				{ 
					role : req.body.role,
					team : req.body.team,
					account : req.body.account 
				 },

		},
		{ upsert: true },
		function(err, newRole){
			if (err) {
				res.end("error on changing account! please try again");
			} else {
				console.log(newRole);
				res.end("Success");
				//res.status(204);
			}
	});
});

//find all data in TEAM

app.get('/admin/accounts/show_team/api/', function(req,res){
	TeamModel.find({})
	.exec()
	.then((team) => {
		console.log(team);
		res.send(team);
	})
	.catch((err) => {
		res.send('error');
	})
});

//find one data in TEAM

app.get('/admin/accounts/show_team/api/:account_id' , function(req,res){
	TeamModel.findById({
		_id:req.params.account_id
	})
	.exec()
	.then((data) => {
		console.log(data);
		res.json(data);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//update one team

app.put('/admin/accounts/show_team/:account_id/:team_id', function(req,res){
	var account_id = req.params.account_id;
	var team_id = req.params.team_id;
	TeamModel.findOneAndUpdate({
		_id : req.params.team_id
	},
		{ 
			$set: 
				{ 
					team_name: req.body.team_name,
				 },

		},
		{ upsert: true },
		function(err, newUpdatedTeam){
			if (err) {
				console.log("errors tanga");
			} else {
				console.log(newUpdatedTeam);
				res.redirect('/admin/accounts/show_accounts/' + account_id + '/' + team_id);
			}
	});
});

//delete accounts

app.delete('/admin/accounts/post/:id', function(req,res){
	Accounts.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((accounts) => {
		console.log(accounts);
		res.json(accounts);
	})
	.catch((err) => {
		res.send('error occured');
	});
});


//delete PMT

app.delete('/admin/delete_pmt/:id', function(req,res){
	PMTModel.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((accounts) => {
		console.log(accounts);
		res.json(accounts);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//delete PMT Log a call

app.delete('/admin/pmtloc_delete/:id', function(req,res){
	PMTlogacall.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((pmtloc) => {
		console.log(pmtloc);
		res.json(pmtloc);
	})
	.catch((err) => {
		res.send('error occured');
	});
});


//delete user

app.delete('/admin/user_delete/:id', function(req,res){
	UsersModel.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((user) => {
		console.log(user);
		res.json(user);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//delete log a call

app.delete('/admin/logAcall_delete/:id', function(req,res){
	LogCall.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((user) => {
		console.log(logacall);
		res.json(logacall);
	})
	.catch((err) => {
		res.send('error occured');
	});
});


//delete task

app.delete('/admin/task_delete/:id', function(req,res){
	Tasks.findOneAndRemove({
		_id: req.params.id
	})
	.exec()
	.then((user) => {
		console.log(task);
		res.json(task);
	})
	.catch((err) => {
		res.send('error occured');
	});
});

//show pmtpost
app.get('/admin/pmt_post/api', function(req,res){
	pmtpostModel.find({})
		.exec()
		.then((pmtPosts) => {
			console.log(pmtPosts);
			res.json(pmtPosts);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//populate data pmtpost

app.get('/admin/pmt_post/merge/api', function(req,res){
	pmtpostModel.find({})
		.populate('created_by')
		.populate('pmt')
		.populate('milestone')
		.exec()
		.then((pmtPosts) => {
			console.log(pmtPosts);
			res.json(pmtPosts);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//get all pmt_post by task_id

app.get('/admin/pmt_post/task/merge/api/:task_id', function(req,res){
	pmtpostModel.find({pmt:req.params.task_id})
		.sort({dateCreated:-1})
		.populate('created_by')
		.populate('pmt')
		.populate('milestone')
		.exec()
		.then((pmtPosts) => {
			console.log(pmtPosts);
			res.json(pmtPosts);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//populate data pmtpost by post id

app.get('/admin/pmt_post/merge/api/:id', function(req,res){
	pmtpostModel.findById({_id:req.params.id})
		.populate('created_by')
		.populate('pmt')
		.populate('milestone')
		.exec()
		.then((pmtPosts) => {
			console.log(pmtPosts);
			res.json(pmtPosts);
		})
		.catch((err) => {
			res.send('error occured');
		});
});

//get all pmt log a call

app.get('/admin/pmt_log_a_call/api', function(req,res){
	PMTlogacall.find({})
		.populate('created_by')
		.populate('task')
		.exec()
		.then((pmt_log_a_call) => {
			console.log(pmt_log_a_call);
			res.json(pmt_log_a_call);
		})
		.catch((err) =>{
			res.send('error occured');
		})
});

//get pmt log a call by ID

app.get('/admin/pmt_log_call/api/:id', function(req,res){
	PMTlogacall.findById({_id:req.params.id})
		.populate('created_by')
		.populate('task')
		.exec()
		.then((pmt_log_a_call) => {
			console.log(pmt_log_a_call);
			res.json(pmt_log_a_call);
		})
		.catch((err) =>{
			res.send('error occured');
		})
});

//get all pmt log a call data by task id

app.get('/admin/pmt_log_a_call/merge/api/:task_id', function(req,res){
	PMTlogacall.find({task:req.params.task_id})
		.populate('created_by')
		.populate('task')
		.exec()
		.then((pmt_log_a_call) => {
			console.log(pmt_log_a_call);
			res.json(pmt_log_a_call);
		})
		.catch((err) =>{
			res.send('error occured');
		})
});


app.use('/', routes);
app.use('/users', Users);
app.use('/admin', admin);
app.use('/admin/projects', project);
app.use('/admin/leads', leadsRoutes);
app.use('/admin/contacts', contactRoutes);
app.use('/admin/opportunity',opportunityRoutes);
app.use('/admin/accounts', AccountsRoutes);
app.use('/admin/campaigns', CampaignRoutes);
app.use('/admin/milestone_tasks', MilestoneTaskRoutes);
app.use('/admin/users', AccountUserRoutes);
app.use('/admin/milestones', MilestoneRoutes);
app.use('/admin/tasks', TasksRoutes);
app.use('/admin/profile', ProfileRoutes);
app.use('/admin/sales_view', SaleViewRoutes);
app.use('/admin/service_view', ServiceViewRoutes);
app.use('/admin/work_view', WorkViewRoutes);
app.use('/admin/project_view',ProjectViewRoutes);
app.use('/admin/work_dashboard', WorkPulsRoutes);

app.use('/home', employee);
app.use('/home/profile', profile);
app.use('/home/accounts/', accountsRoutes);

app.use('/panel', PanelRoutes);

// app.set('port', (process.env.PORT || 8080));

// server.listen(app.get('port'), function(){
// 	console.log('server started on part '+ app.get('port'));
// });

app.listen(process.env.PORT || 3000, function(){
	console.log('listening on port 3000');
});
