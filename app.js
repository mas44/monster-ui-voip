define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster');

	var subModules = {
			devices: require('./submodules/devices/devices.js'),
			groups: require('./submodules/groups/groups.js'),
			myOffice: require('./submodules/myOffice/myOffice.js'),
			numbers: require('./submodules/numbers/numbers.js'),
			strategy: require('./submodules/strategy/strategy.js'),
			users: require('./submodules/users/users.js'),
			callLogs: require('./submodules/callLogs/callLogs.js')
		};

	var app = {

		name: 'voip',

		i18n: [ 'en-US', 'fr-FR' ],

		requests: {
			'voip.users.getUsers': {
				url: 'accounts/{accountId}/users',
				verb: 'GET'
			},
			'voip.groups.listGroups': {
				url: 'accounts/{accountId}/groups',
				verb: 'GET'
			},
			'common.numbers.list': {
				url: 'accounts/{accountId}/phone_numbers',
				verb: 'GET'
			},
			'voip.devices.listDevices': {
				url: 'accounts/{accountId}/devices',
				verb: 'GET'
			},
		},

		subscribe: {
		},

		load: function(callback){
			var self = this;

			self.initApp(function() {
				callback && callback(self);
			});
		},

		initApp: function(callback) {
			var self = this;

			monster.pub('auth.initApp', {
				app: self,
				callback: callback
			});
		},

		render: function(container){
			var self = this,
				parent = container || $('#ws-content'),
				template = $(monster.template(self, 'app'));

			/* On first Load, load my office */
			template.find('.category#my_office').addClass('active');
			monster.pub('voip.myOffice.render', { parent: template.find('.right-content') });

			self.bindEvents(template);

			parent
				.empty()
				.append(template);
		},

		formatData: function(data) {
			var self = this;
		},

		bindEvents: function(parent) {
			var self = this,
				container = parent.find('.right-content');

			parent.find('.category').on('click', function() {
				parent
					.find('.category')
					.removeClass('active');

				container.empty();

				$(this).toggleClass('active');
			});

			var args = {
				parent: container
			};

			parent.find('.category#my_office').on('click', function() {
				monster.pub('voip.myOffice.render', args);
			});

			parent.find('.category#users').on('click', function() {
				monster.pub('voip.users.render', args);
			});

			parent.find('.category#groups').on('click', function() {
				monster.pub('voip.groups.render', args);
			});

			parent.find('.category#numbers').on('click', function() {
				monster.pub('voip.numbers.render', container);
			});

			parent.find('.category#devices').on('click', function() {
				monster.pub('voip.devices.render', args);
			});

			parent.find('.category#strategy').on('click', function() {
				monster.pub('voip.strategy.render', args);
			});

			parent.find('.category#call_logs').on('click', function() {
				monster.pub('voip.callLogs.render', args);
			});
		}
	};

	$.each(subModules, function(k, subModule) {
		$.extend(true, app, subModule);
	});

	return app;
});