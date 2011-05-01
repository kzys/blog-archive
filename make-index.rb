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

def create_index_2010(year, files, pattern)
  by_month = Hash.new do
    []
  end

  files.each do |path|
    content = path.read
    title = content.scan(%r{<title>(.*)</title>})[0][0]
    year, month, day = *content.scan(pattern)[0]
    title = title.gsub(/^blog\.8-p\.info: /, '').gsub(/ - blog\.8-p\.info$/, '')
    by_month[month.to_i] += [ { month: month,
                                title: title,
                                path: path,
                                day: day } ]
  end

  months = by_month.keys.sort.map do |m|
    [m, by_month[m].sort do |a, b| a[:day] <=> b[:day] end]
  end

  template = ERB.new(File.read('index.html.erb'))
  File.open("#{year}/index.html", 'w').print(template.result(binding))
end

create_index(2005)
create_index(2006)
create_index(2007)

create_index_2010(2008,
                  Dir.glob("2008/*").map do |s|
                    Pathname(s)
                  end.delete_if do |path|
                    not path.basename.to_s =~ /^\d+$/
                  end,
                  %r{(\d{4})-(\d{2})-(\d{2})T})

create_index_2010(2009,
                  Dir.glob("2009/*/*").map do |s|
                    Pathname(s)
                  end.delete_if do |path|
                    not path.to_s =~ %r{^\d{4}/\d{2}/}
                  end,
                  %r{(\d{4})-(\d{2})-(\d{2})})

create_index_2010(2010,
                  Dir.glob("2010/*").sort do |a, b|
                    a.to_i <=> b.to_i
                  end.map do |s|
                    Pathname(s)
                  end.delete_if do |path|
                    not path.basename.to_s =~ /^\d+-?/
                  end,
                  %r{Posted at (\d{4})/(\d{2})/(\d{2})})
