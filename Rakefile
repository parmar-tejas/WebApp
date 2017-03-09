# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

desc "Generate Intercom config"
task :intercom-config do
	system rails generate intercom:config p1olv87a
     end

