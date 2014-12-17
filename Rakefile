#! ruby
require 'tmpdir'

task :default => :publish

file '2011/_site' => [ '2011' ] do
  Dir.chdir('2011') do
    sh 'jekyll build'
  end
end

def symlink_dirs(build_dir)
  File.symlink(File.expand_path('2011/_site'), "#{build_dir}/2011")

  Dir.glob('2005-2010/*').select do |s|
    basename = File.basename(s)
    basename =~ /^(articles|images|stylesheets|\d+)$/
  end.each do |src|
    File.symlink(File.expand_path(src), "#{build_dir}/#{File.basename(src)}")
  end
end

task :publish, [:build_dir] => [ '2011/_site', '2005-2010' ] do |task, args|
  build_symlink_dirs = proc do |build_dir|
    symlink_dirs(build_dir)
    sh("ruby make-index.rb #{build_dir}")
    sh("rsync -r --copy-dirlinks #{build_dir}/ alice@192.241.193.164:/home/alice/www/blog/public/")
  end

  if args[:build_dir]
    build_symlink_dirs.call(args[:build_dir])
  else
    Dir.mktmpdir do |dir|
      build_symlink_dirs.call(dir)
    end
  end
end

file '2011' do
  sh 'git clone git@github.com:kzys/2011.git'
end

file '2005-2010' do
  sh 'git clone git@github.com:kzys/2005-2010.git'
end
