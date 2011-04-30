# -*- coding: utf-8 -*-
require 'pathname'
require 'erb'

def create_index(year)
  files = Dir.glob("articles/#{year}/**/*").sort.map do |s|
    Pathname(s)
  end.delete_if do |path|
    not path.file?
  end

  by_month = Hash.new do
    []
  end

  rows = files.map do |path|
    title = path.read.scan(%r{<title>(.*)</title>})[0][0]
    title.gsub!(/^blog\.8-p\.info: /, '')
    year, month, day = *path.to_s.scan(%r{(\d{4})/(\d{1,2})/(\d{1,2})})[0]
    by_month[month.to_i] += [ {month: month, title: title, path: path} ]
  end

  months = by_month.keys.map do |m|
    [m, by_month[m]]
  end

  template = ERB.new(File.read('index.html.erb'))
  File.open("#{year}/index.html", 'w').print(template.result(binding))
end

create_index(2005)
create_index(2006)
create_index(2007)
