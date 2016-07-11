#! ruby
require 'tmpdir'

task :default => :publish

file '2011/_site' => [ '2011' ] do
  Dir.chdir('2011') do
    sh 'jekyll build'
  end
end

def create_link(from, to)
  return if File.symlink?(to)
  File.symlink(from, to)
end

def symlink_dirs(build_dir)
  create_link(File.expand_path('2011/_site'), "#{build_dir}/2011")

  Dir.glob('2005-2010/*').select do |s|
    basename = File.basename(s)
    basename =~ /^(articles|images|stylesheets|\d+)$/
  end.each do |src|
    create_link(File.expand_path(src), "#{build_dir}/#{File.basename(src)}")
  end
end

task :build => [ '2011/_site', '2005-2010' ] do |task, args|
  mkdir_p 'build/private'
  symlink_dirs('build/private')
  sh("ruby make-index.rb build/private")
end

task :publish => [:build] do |task, args|
  mkdir_p 'build/public'
  sh("tar cvzLf build/public/site.tar.gz -C build/private .")
end

task :clean do
  files = Dir.glob('build/*').select do |path|
    File.symlink?(path)
  end
  rm files
end
