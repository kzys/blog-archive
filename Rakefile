#! ruby
require 'tmpdir'

task :default => :publish

task :publish => [ '2011', '2005-2010' ] do
  Dir.chdir('2011') do
    sh 'jekyll build'
  end

  Dir.mktmpdir do |build_dir|
    Dir.glob('2005-2010/*').select do |s|
      basename = File.basename(s)
      basename == 'articles' or basename =~ /^\d+$/
    end.each do |src|
      File.symlink(File.expand_path(src), "#{build_dir}/#{File.basename(src)}")
    end

    File.symlink(File.expand_path('2011/_site'), "#{build_dir}/2011")

    sh("rsync -r --copy-dirlinks #{build_dir}/ alice@192.241.193.164:/home/alice/www/blog/public/")
  end
end

file '2011' do
  sh 'git clone git@github.com:kzys/2011.git'
end

file '2005-2010' do
  sh 'git clone git@github.com:kzys/2005-2010.git'
end
